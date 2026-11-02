"""
MCP CLIENT + AGENT LOOP.

Connects to an MCP server, DISCOVERS its tools at runtime (nothing is hard-coded),
then runs the same think -> act -> observe loop as the earlier agent.
The only change: tools now come from the MCP server instead of local functions.

Setup:   pip install anthropic mcp
Real:    export ANTHROPIC_API_KEY="your-key" ; python mcp_agent_client.py
No key:  python mcp_agent_client.py --demo      (scripted fake model)
"""
import asyncio
import json
import sys
from types import SimpleNamespace

from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

MODEL_NAME = "claude-sonnet-5-5"
MAX_STEPS = 10
GOAL = "Find the cheapest flight from Hyderabad to Delhi next Friday and add it to my calendar."


# ---- fake model for --demo (same response shape as the real API) ----
class FakeClient:
    def __init__(self):
        self.messages, self.turn = self, 0

    def create(self, **kw):
        self.turn += 1
        tu = lambda i, n, inp: SimpleNamespace(type="tool_use", id=i, name=n, input=inp)
        if self.turn == 1:
            return SimpleNamespace(stop_reason="tool_use", content=[tu(
                "t1", "search_flights", {"origin": "Hyderabad", "destination": "Delhi", "date": "2026-11-06"})])
        if self.turn == 2:
            return SimpleNamespace(stop_reason="tool_use", content=[tu(
                "t2", "add_calendar_event", {"title": "Flight 6E-231 to Delhi", "date": "2026-11-06", "time": "09:30"})])
        return SimpleNamespace(stop_reason="end_turn", content=[SimpleNamespace(
            type="text", text="Done! Cheapest is 6E-231 at 09:30 for Rs 4,300. It is on your calendar.")])


async def main():
    llm = FakeClient() if "--demo" in sys.argv else __import__("anthropic").Anthropic()

    # 1. LAUNCH the MCP server as a subprocess and connect over stdio
    params = StdioServerParameters(command=sys.executable, args=["mcp_flight_server.py"])
    async with stdio_client(params) as (read, write):
        async with ClientSession(read, write) as session:

            # 2. HANDSHAKE: client and server agree on protocol version + capabilities
            await session.initialize()

            # 3. DISCOVER what the server offers
            tools = (await session.list_tools()).tools
            print("Tools found on server:", [t.name for t in tools])

            resources = (await session.list_resources()).resources
            for r in resources:
                content = await session.read_resource(r.uri)
                print(f"Resource {r.uri}:", content.contents[0].text)

            # 4. Convert MCP tool descriptions into the format the model expects
            tool_specs = [{"name": t.name, "description": t.description or "",
                           "input_schema": getattr(t, "input_schema", None) or t.inputSchema}
                           for t in tools]  # field name differs between mcp 1.x / 2.x

            # 5. THE SAME AGENT LOOP
            messages = [{"role": "user", "content": GOAL}]
            print("\nGOAL:", GOAL)

            for step in range(1, MAX_STEPS + 1):
                print(f"\n--- Step {step}: asking the model ---")
                response = llm.messages.create(
                    model=MODEL_NAME, max_tokens=1024, tools=tool_specs, messages=messages,
                    system="You are a travel assistant. Today is 2026-10-30. Use tools to finish the task.")
                messages.append({"role": "assistant", "content": response.content})

                if response.stop_reason != "tool_use":
                    print("\nFINAL ANSWER:", "".join(b.text for b in response.content if b.type == "text"))
                    return

                results = []
                for block in response.content:
                    if block.type == "tool_use":
                        print(f"   [client] calling MCP tool: {block.name}({block.input})")
                        # THE KEY MCP CALL: ask the server to run the tool
                        out = await session.call_tool(block.name, block.input)
                        text = "".join(c.text for c in out.content if hasattr(c, "text"))
                        results.append({"type": "tool_result", "tool_use_id": block.id,
                                        "content": text, "is_error": bool(getattr(out, "is_error", getattr(out, "isError", False)))})
                messages.append({"role": "user", "content": results})

            print("Stopped: max steps reached.")


asyncio.run(main())
