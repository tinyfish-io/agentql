"""This example demonstrates how to scrape information from Google Maps into a CSV file."""

import os

from playwright.sync_api import sync_playwright

import agentql

# Set the URL to the Google Maps search for "boba tea" near Palo Alto
URL = "https://www.google.com/maps/search/boba+tea/@37.4400289,-122.1653309,14z/data=!3m1!4b1?entry=ttu&g_ep=EgoyMDI1MDIxMS4wIKXMDSoASAFQAw%3D%3D"

# Define the queries to interact with the page usng prompts to narrow down the results
QUERY = """
{
    listings[] {
        name
        rating(in stars)
        description(if not available, use "n/a")
        order_link(if not available, use "n/a")
        take_out_link(if not available, use "n/a")
        address
        hours
    }
}
"""


def main():
    with sync_playwright() as playwright, playwright.chromium.launch(headless=False) as browser:
        # Create a new page in the browser and wrap it to get access to the AgentQL's querying API
        page = agentql.wrap(browser.new_page())

        page.goto(URL)

        # Use query_data() method to fetch the data from the page
        response = page.query_data(QUERY)

        #  Get the directory of the current script
        script_dir = os.path.dirname(os.path.abspath(__file__))

        # Create path to the csv file
        csv_file_path = os.path.join(script_dir, "map_data.csv")

        # Write the data to a csv file
        with open(csv_file_path, "w", encoding="utf-8") as file:
            file.write("Name, Rating, Description, Order Link, Take Out Link, Address, Hours\n")
            for listing in response["listings"]:
                file.write(
                    f"{listing['name']},{listing['rating']},{listing['description']},{listing['order_link']},{listing['take_out_link']},{listing['address']},{listing['hours']} \n"
                )


if __name__ == "__main__":
    main()
