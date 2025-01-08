import json
import logging

from playwright.sync_api import sync_playwright

import agentql

logging.basicConfig(level=logging.DEBUG)
log = logging.getLogger(__name__)

if __name__ == "__main__":
    with sync_playwright() as playwright, playwright.chromium.launch(headless=False) as browser:
        page = agentql.wrap(browser.new_page())
        page.goto("https://wristler.eu/sellers?page=1")

        QUERY = """
        {
            sellers[] {
                name
            }
        }
        """

        for i in range(3):
            response = page.query_data(QUERY)
            with open(f"./sellers_{i}.json", "w") as f:
                json.dump(response, f, indent=4)

            log.debug("Navigating to next page...")
            pagination_info = page.get_pagination_info()

            # attempt to navigate to next page
            if pagination_info.has_next_page:
                pagination_info.navigate_to_next_page()

        page.wait_for_timeout(1000)
