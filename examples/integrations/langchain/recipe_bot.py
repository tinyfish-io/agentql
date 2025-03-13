import asyncio
import getpass
import os

from langchain.chat_models import init_chat_model
from langchain_agentql import AgentQLBrowserToolkit
from langchain_agentql.utils import create_async_playwright_browser
from langchain_community.tools import DuckDuckGoSearchResults
from langchain_community.tools.file_management.write import WriteFileTool
from langchain_community.tools.playwright import ClickTool, NavigateTool
from langgraph.prebuilt import create_react_agent


async def main():

    # Instantiate LLM
    if not os.environ.get("OPENAI_API_KEY"):
        os.environ["OPENAI_API_KEY"] = getpass.getpass("Enter API key for OpenAI: ")

    model = init_chat_model("gpt-4o-mini", model_provider="openai")

    # Create Playwright browser instance
    async_agent_browser = await create_async_playwright_browser(headless=True)

    # Get tools
    agentql_toolkit = AgentQLBrowserToolkit(async_browser=async_agent_browser)

    search_write_tools = [
        DuckDuckGoSearchResults(output_format="list"),
        WriteFileTool(),
    ]

    playwright_toolkit = [
        NavigateTool(async_browser=async_agent_browser),
        ClickTool(async_browser=async_agent_browser, visible_only=False),
    ]

    # Create agent
    agent_executor = create_react_agent(
        model, agentql_toolkit.get_tools() + playwright_toolkit + search_write_tools
    )

    prompt = """
    Search for an easy and quick recipe for baking oatmeal cookies. Click on the link for the oatmeal cookie recipe, and in the URL link, extract the ingredients needed and instructions and put it in a CSV file.
    """

    # Execute agent
    events = agent_executor.astream(
        {"messages": [("user", prompt)]},
        stream_mode="values",
    )

    async for event in events:
        event["messages"][-1].pretty_print()


asyncio.run(main())
