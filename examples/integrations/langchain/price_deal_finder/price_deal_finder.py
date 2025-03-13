import asyncio
import getpass
import os

from langchain.chat_models import init_chat_model
from langchain_agentql import AgentQLBrowserToolkit
from langchain_agentql.utils import create_async_playwright_browser
from langchain_community.tools.playwright import ClickTool, NavigateTool
from langgraph.prebuilt import create_react_agent


async def main():

    # Instantiate LLM
    if not os.environ.get("OPENAI_API_KEY"):
        os.environ["OPENAI_API_KEY"] = getpass.getpass("Enter API key for OpenAI: ")

    llm = init_chat_model(model="gpt-4o", model_provider="openai")

    # Create Playwright browser isntance
    async_agent_browser = await create_async_playwright_browser(headless=True)

    # Get tools
    agentql_toolkit = AgentQLBrowserToolkit(async_browser=async_agent_browser)

    playwright_toolkit = [
        NavigateTool(async_browser=async_agent_browser),
        ClickTool(async_browser=async_agent_browser, visible_only=False),
    ]

    # Create agent
    agent_executor = create_react_agent(llm, agentql_toolkit.get_tools() + playwright_toolkit)

    prompt = """
    Head over to this URL link: https://www.amazon.com/s?k=ipad+11+inch+case+with+keyboard&crid=2HY1NECK2NQJ6&sprefix=ipad+11+inch+case+with+keyboar%2Caps%2C189&ref=nb_sb_noss_2 and find an iPad 11-inch case under $25 with at least a 4.5 out of 5 star rating.
    Click on the product and provide its details, including the product name, price, link to buy the product, and a summary of the reviews of the product.
    """

    # Execute agent
    events = agent_executor.astream(
        {"messages": [("user", prompt)]},
        stream_mode="values",
    )
    async for event in events:
        event["messages"][-1].pretty_print()


asyncio.run(main())
