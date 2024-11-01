/* This example demonstrates how to get XPath of an element that was fetched with AgentQL */

const { wrap } = require('agentql');
const { chromium } = require('playwright');

// Import the xPath function from the playwright-dompath package.
const { xPath } = require('playwright-dompath');

// Define the URL of the page to scrape.
const URL = 'https://scrapeme.live/shop/';

// Define the query to locate the search box.
const QUERY = `
{
    search_products_box
}
`;

async function main() {
  // Launch a headless browser using Playwright.
  const browser = await chromium.launch({ headless: false });

  // Create a new page in the browser and wrap it to get access to the AgentQL's querying API
  const page = await wrap(await browser.newPage());
  await page.goto(URL);

  // Use queryElements() method to locate the search box from the page.
  const response = await page.queryElements(QUERY);

  // Get the XPath of the search box element.
  console.log('XPath:', await xPath(response.search_products_box));

  // Close the browser.
  await browser.close();
}

main();
