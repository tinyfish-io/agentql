"""This script collects news headlines from a selection of URLs and saves the results to a CSV file."""

import asyncio
import logging
import os

from playwright.async_api import BrowserContext, async_playwright

import agentql

# Set up logging
logging.basicConfig(level=logging.INFO)
LOG = logging.getLogger(__name__)

# Define the queries to interact with the page
QUERY = """
{
    items(might be aritcles, posts, tweets)[]{
        published_date(convert to XX/XX/XXXX format)
        entry(title or post if no title is available)
        author(person's name; return "n/a" if not available)
        outlet(the original platform it is posted on; if no platform is listed, use the root domain of the url)
        url
    }
}
"""

# Set URLs to the desired websites
WEBSITE_URLS = [
    "https://bsky.app/search?q=agents+for+the+web",
    "https://dev.to/search?q=agents%20for%20the%20web&sort_by=published_at&sort_direction=desc",
    "https://hn.algolia.com/?dateRange=last24h&page=0&prefix=false&query=agents%20for%20the%20web&sort=byDate&type=story",
    "https://duckduckgo.com/?q=agents+for+the+web&t=h_&iar=news&ia=news",
]
# Make a CSV file to store the data
#  Get the directory of the current script
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

# Create path to the csv file
CSV_FILE_PATH = os.path.join(SCRIPT_DIR, "news_headlines.csv")


async def main():
    """Fetch data concurrently in the same browser session from multiple websites."""
    async with async_playwright() as p, await p.chromium.launch(
        headless=True
    ) as browser, await browser.new_context() as context:
        # Open multiple tabs in the same browser context to fetch data concurrently
        await asyncio.gather(
            *(fetch_data(context, url) for url in WEBSITE_URLS)
        )  
        
     # Update progress
    LOG.info("All done! CSV is here: %s...", CSV_FILE_PATH)


async def fetch_data(context: BrowserContext, session_url):
    """Open the given URL in a new tab and fetch the data."""
    page = await agentql.wrap_async(context.new_page())
    await page.goto(session_url)

    data = await page.query_data(QUERY)

    # Prepare new data
    new_lines = []
    for item in data["items"]:
        # Strip '|' from entry to avoid CSV formatting issues
        clean_entry = item["entry"].replace("|", "")
        new_lines.append(
            f"{item['published_date']} | {clean_entry} | {item['url']} | {item['outlet']} | {item['author']}\n"
        )

    # Handle file writing with proper header management
    if not os.path.exists(CSV_FILE_PATH):
        # New file - write header and data
        with open(CSV_FILE_PATH, "w", encoding="utf-8") as file:
            file.write("Posted | Entry | URL | Platform | Author\n")
            file.writelines(new_lines)
    else:
        # File exists - append new data while preserving existing content
        with open(CSV_FILE_PATH, "a", encoding="utf-8") as file:
            file.writelines(new_lines)

    ## Update progress
    LOG.info("Fetched items from %s...", session_url)


if __name__ == "__main__":
    # Run the main function in an event loop
    asyncio.run(main())
