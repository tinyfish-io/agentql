"""This example demonstrates how to leverage get_by_prompt method to interact with element by prompt text."""

import agentql
from playwright.sync_api import sync_playwright

# Set the URL to the desired website
URL = "https://duckduckgo.com/"


def main():
    with sync_playwright() as p, p.chromium.launch(headless=False) as browser:

        page = agentql.wrap(browser.new_page())  # Wrapped to access AgentQL's query API's

        # Navigate to the URL
        page.goto(URL)

        # Get the search bar with the prompt text
        search_bar = page.get_by_prompt("the search bar")

        # Fill out the search bar, if it exists
        if search_bar:
            search_bar.fill("AgentQL")

            # Click the search button
            page.get_by_prompt("the search button").click()

        # Used only for demo purposes. It allows you to see the effect of the script.
        page.wait_for_timeout(10000)


if __name__ == "__main__":
    main()
