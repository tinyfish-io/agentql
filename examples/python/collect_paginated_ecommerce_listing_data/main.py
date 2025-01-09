import json
import logging

from playwright.sync_api import sync_playwright

import agentql

logging.basicConfig(level=logging.DEBUG)
log = logging.getLogger(__name__)

if __name__ == "__main__":
    with sync_playwright() as playwright, playwright.chromium.launch(headless=False) as browser:
        page = agentql.wrap(browser.new_page())
        page.goto("https://books.toscrape.com/")

        # define the query to extract product names, prices, and ratings
        QUERY = """
        {
            books[] {
                name
                price
                rating
            }
        }
        """

        books = []

        # Aggregate the first 50 book names, prices and ratings
        while len(books) < 50:
            # collect data from the current page
            response = page.query_data(QUERY)

            # limit the total number of books to 50
            if len(response["books"]) + len(books) > 50:
                books.extend(response["books"][:50 - len(books)])
            else:
                books.extend(response["books"])

            # get the pagination info from the current page
            pagination_info = page.get_pagination_info()

            # attempt to navigate to next page
            if pagination_info.has_next_page:
                pagination_info.navigate_to_next_page()

        with open(f"./books.json", "w") as f:
            json.dump(books, f, indent=4)
