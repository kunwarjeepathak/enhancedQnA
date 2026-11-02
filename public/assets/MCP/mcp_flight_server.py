"""
MCP SERVER - exposes flight tools, a resource and a prompt over MCP.

This file knows nothing about Claude or any agent. It only describes what it
offers. ANY MCP client (Claude Desktop, your own app, an IDE) can connect to it.

Run it directly? You normally don't: the client launches it as a subprocess
and talks to it over stdio.

IMPORTANT: with stdio transport never use print() - stdout is the protocol channel.
Use stderr for logging.
"""
import sys

try:                                           # mcp 1.x
    from mcp.server.fastmcp import FastMCP as Server
except ImportError:                            # mcp 2.x renamed it
    from mcp.server.mcpserver import MCPServer as Server

server = Server("flight-assistant")


def log(msg):
    print(msg, file=sys.stderr)


# ---------- TOOLS: actions the AI model can ask for ----------
@server.tool()
def search_flights(origin: str, destination: str, date: str) -> list[dict]:
    """Find flights between two cities on a date (YYYY-MM-DD). Prices in INR."""
    log(f"[server] search_flights {origin}->{destination} {date}")
    return [
        {"flight": "AI-544", "departs": "06:00", "price_inr": 5200},
        {"flight": "6E-231", "departs": "09:30", "price_inr": 4300},
        {"flight": "UK-882", "departs": "18:15", "price_inr": 6100},
    ]


@server.tool()
def add_calendar_event(title: str, date: str, time: str) -> dict:
    """Add an event to the user's calendar. date is YYYY-MM-DD, time is HH:MM."""
    log(f"[server] add_calendar_event {title} {date} {time}")
    return {"status": "created", "title": title, "date": date, "time": time}


# ---------- RESOURCE: read-only data the app can load as context ----------
@server.resource("user://preferences")
def user_preferences() -> str:
    """The user's travel preferences."""
    return "Home airport: Hyderabad (HYD). Prefers morning flights. Seat: window."


# ---------- PROMPT: a reusable template the user can pick ----------
@server.prompt()
def plan_trip(destination: str) -> str:
    """Template: plan a trip to a destination."""
    return (f"Find the cheapest flight from Hyderabad to {destination} next Friday "
            f"and add it to my calendar.")


if __name__ == "__main__":
    server.run()   # default transport = stdio
