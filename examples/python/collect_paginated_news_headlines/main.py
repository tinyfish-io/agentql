import json
import logging

from playwright.sync_api import sync_playwright

import agentql

# import paginate tool from agentql tools
from agentql.tools.sync_api import paginate

logging.basicConfig(level=logging.DEBUG)
log = logging.getLogger(__name__)


if __name__ == "__main__":
    with sync_playwright() as playwright, playwright.chromium.launch(headless=False) as browser:
        page = agentql.wrap(browser.new_page())
        page.goto("https://news.ycombinator.com/")

        # define the query to extract post titles
        QUERY = """
        {
            posts[] {
                title
            }
        }
        """
        # collect all data over the next 3 pages with the query defined above
        paginated_data = paginate(page, QUERY, 3)

        # save the aggregateddata to a json file
        with open("./hackernews_paginated_data.json", "w") as f:
            json.dump(paginated_data, f, indent=4)
        log.debug("Paginated data has been saved to hackernews_paginated_data.json")
