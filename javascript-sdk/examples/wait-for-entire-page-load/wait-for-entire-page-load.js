/* This example demonstrates how to wait for the page to load completely before querying the page. */

const { wrap } = require('agentql');
const { chromium } = require('playwright');

// Duckduckgo URL to demonstrate the example for loading more videos on the page
const URL =
  'https://duckduckgo.com/?q=machine+learning+lectures+mit&t=h_&iar=videos&iax=videos&ia=videos';

// Define the query to
const QUERY = `
{
    videos(first 10 videos)[] {
        video_title
        length
        views
    }
}
`;

async function main() {
  // Launch a headless browser using Playwright.
  const browser = await chromium.launch({ headless: false });

  // Create a new page in the browser and wrap it to get access to the AgentQL's querying API
  const page = await wrap(await browser.newPage());
  await page.goto(URL);

  for (let i = 0; i < 2; i++) {
    // Wait for the page to load completely.
    page.waitForPageReadyState();

    // Scroll to the bottom of the page to load more videos.
    page.keyboard.press('End');
  }

  // Use query_data() method to fetch video lists data from the page.
  const response = await page.queryData(QUERY);

  // Print the first video details.
  console.log(response['videos'][0]);

  // Close the browser.
  await browser.close();
}

main();
