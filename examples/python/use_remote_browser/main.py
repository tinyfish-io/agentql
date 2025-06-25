"""This example demonstrates how to interact with an remote browser with AgentQL."""

import asyncio

import agentql
from agentql.tools.async_api import BrowserSession, UserAgentPreset, create_browser_session
from playwright.async_api import async_playwright

URL = "https://scrapeme.live/shop"

SEARCH_QUERY = """
{
    search_products_box
}
"""

STOCK_QUERY = """
{
    number_in_stock
}
"""


async def get_remote_browser_url() -> str:
    """This function creates a new browser session."""
    # Create a browser session with Windows user agent preset
    session: BrowserSession = await create_browser_session(ua_preset=UserAgentPreset.WINDOWS)
    cdp_url = session.cdp_url
    print(f"Remote browser URL: {cdp_url}")
    print(f"Page streaming URL: {session.get_page_streaming_url(0)}")
    return cdp_url


async def run_in_remote_browser():
    """This function demonstrates how to open and interact with a new page using remote browser."""
    browser_url = await get_remote_browser_url()
    async with async_playwright() as p:
        # Connect to the browser via Chrome DevTools Protocol
        browser = await p.chromium.connect_over_cdp(browser_url)

        # Create a new tab in the browser window and wrap it to get access to the AgentQL's querying API
        page = await browser.new_page()
        page = await agentql.wrap_async(page)

        await page.goto(URL)

        # Use query_elements() method to locate the search product box from the page
        response = await page.query_elements(SEARCH_QUERY)

        # Use Playwright's API to fill the search box and press Enter
        await response.search_products_box.type("Charmander")
        await page.keyboard.press("Enter")

        # Use query_data() method to fetch the stock number from the page
        response = await page.query_data(STOCK_QUERY)

        print(response)


if __name__ == "__main__":
    asyncio.run(run_in_remote_browser())
