"""This example demonstrates how to interact with an external browser with AgentQL."""

import os

import agentql
import httpx
from playwright.sync_api import sync_playwright

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

AGENTQL_API_KEY = os.getenv("AGENTQL_API_KEY")


def get_remote_browser_url():
    """This function allocates a new browser instance."""
    with httpx.Client() as client:
        response = client.post(
            "https://api.agentql.com/tetra/sessions",
            headers={"X-API-Key": AGENTQL_API_KEY},
        )
        response.raise_for_status()
        session = response.json()
        cdp_url = session["cdp_url"]
        print(f"Remote browser URL: {cdp_url}")
        return cdp_url


def run_in_external_browser():
    """This function demonstrates how to open and interact with a new page using remote browser."""
    browser_url = get_remote_browser_url()
    with sync_playwright() as p:
        # Connect to the browser via Chrome DevTools Protocol
        browser = p.chromium.connect_over_cdp(browser_url)

        # Create a new tab in the browser window and wrap it to get access to the AgentQL's querying API
        page = browser.new_page()
        page = agentql.wrap(page)

        page.goto(URL)

        # Use query_elements() method to locate the search product box from the page
        response = page.query_elements(SEARCH_QUERY)

        # Use Playwright's API to fill the search box and press Enter
        response.search_products_box.type("Charmander")
        page.keyboard.press("Enter")

        # Use query_data() method to fetch the stock number from the page
        response = page.query_data(STOCK_QUERY)

        print(response)


if __name__ == "__main__":
    run_in_external_browser()
