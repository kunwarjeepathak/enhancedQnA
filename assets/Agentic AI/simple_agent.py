"""
A minimal working AI agent.

Shows the four parts:
  MODEL  -> Claude decides what to do next
  TOOLS  -> plain Python functions (fake flight search + fake calendar)
  MEMORY -> the `messages` list (short-term memory)
  LOOP   -> the while loop that keeps going until the model gives a final answer

Run for real:   pip install anthropic
                export ANTHROPIC_API_KEY="your-key"
                python simple_agent.py

Run without a key (scripted fake model, just to watch the loop work):
                python simple_agent.py --demo
"""
import json
import sys
from types import SimpleNamespace

MODEL_NAME = "claude-sonnet-5-5"
MAX_STEPS = 10  # safety limit so the loop can never run forever

# ---------------------------------------------------------------
# 1. TOOLS  (the hands) - ordinary Python functions
# ---------------------------------------------------------------
def search_flights(origin, destination, date):
    print(f"   [tool] search_flights({origin} -> {destination}, {date})")
    return [  # fake data; a real tool would call a flight API
        {"flight": "AI-544", "departs": "06:00", "price_inr": 5200},
        {"flight": "6E-231", "departs": "09:30", "price_inr": 4300},
        {"flight": "UK-882", "departs": "18:15", "price_inr": 6100},
    ]

def add_calendar_event(title, date, time):
    print(f"   [tool] add_calendar_event({title}, {date}, {time})")
    return {"status": "created", "title": title, "date": date, "time": time}

TOOL_FUNCTIONS = {"search_flights": search_flights, "add_calendar_event": add_calendar_event}

# Descriptions the model reads, like a menu
TOOL_SPECS = [
    {
        "name": "search_flights",
        "description": "Find flights between two cities on a date. Returns flight, departure time and price in INR.",
        "input_schema": {
            "type": "object",
            "properties": {
                "origin": {"type": "string"},
                "destination": {"type": "string"},
                "date": {"type": "string", "description": "YYYY-MM-DD"},
            },
            "required": ["origin", "destination", "date"],
        },
    },
    {
        "name": "add_calendar_event",
        "description": "Add an event to the user's calendar.",
        "input_schema": {
            "type": "object",
            "properties": {
                "title": {"type": "string"},
                "date": {"type": "string", "description": "YYYY-MM-DD"},
                "time": {"type": "string", "description": "HH:MM"},
            },
            "required": ["title", "date", "time"],
        },
    },
]

# ---------------------------------------------------------------
# Fake model, only used with --demo so you can see the loop without an API key
# ---------------------------------------------------------------
class FakeClient:
    def __init__(self):
        self.messages = self
        self.turn = 0

    def create(self, **kwargs):
        self.turn += 1
        tu = lambda i, n, inp: SimpleNamespace(type="tool_use", id=i, name=n, input=inp)
        if self.turn == 1:
            return SimpleNamespace(stop_reason="tool_use", content=[
                tu("t1", "search_flights", {"origin": "Hyderabad", "destination": "Delhi", "date": "2026-11-06"})])
        if self.turn == 2:
            return SimpleNamespace(stop_reason="tool_use", content=[
                tu("t2", "add_calendar_event", {"title": "Flight 6E-231 to Delhi", "date": "2026-11-06", "time": "09:30"})])
        return SimpleNamespace(stop_reason="end_turn", content=[
            SimpleNamespace(type="text", text="Done! The cheapest flight is 6E-231 at 09:30 for Rs 4,300. It is on your calendar.")])

# ---------------------------------------------------------------
# 2. THE AGENT LOOP  (the manager)
# ---------------------------------------------------------------
def run_agent(goal, client):
    # 3. MEMORY (short-term): everything that has happened so far
    messages = [{"role": "user", "content": goal}]

    for step in range(1, MAX_STEPS + 1):
        print(f"\n--- Step {step}: asking the model ---")

        # THINK: the model reads the goal + history + tool menu
        response = client.messages.create(
            model=MODEL_NAME,
            max_tokens=1024,
            system="You are a helpful travel assistant. Today is 2026-10-30. Use tools to complete the task.",
            tools=TOOL_SPECS,
            messages=messages,
        )

        # Remember what the model said
        messages.append({"role": "assistant", "content": response.content})

        # FINAL ANSWER? -> stop the loop
        if response.stop_reason != "tool_use":
            return "".join(b.text for b in response.content if b.type == "text")

        # ACT: the model asked for tool(s). We run them for real.
        tool_results = []
        for block in response.content:
            if block.type == "tool_use":
                try:
                    result = TOOL_FUNCTIONS[block.name](**block.input)
                except Exception as e:           # errors go back to the model too
                    result = {"error": str(e)}
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": json.dumps(result),
                })

        # OBSERVE: feed the results back so the model sees them next round
        messages.append({"role": "user", "content": tool_results})

    return "Stopped: reached the maximum number of steps."


if __name__ == "__main__":
    goal = "Find the cheapest flight from Hyderabad to Delhi next Friday and add it to my calendar."
    if "--demo" in sys.argv:
        client = FakeClient()
    else:
        import anthropic
        client = anthropic.Anthropic()  # reads ANTHROPIC_API_KEY from environment

    print("GOAL:", goal)
    answer = run_agent(goal, client)
    print("\nFINAL ANSWER:", answer)
