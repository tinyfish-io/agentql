/* This example demonstrates how to run the script in a headless browser. */

const { wrap, configure } = require('agentql');
const { chromium } = require('playwright');

// Define the URL of the page to scrape.
const URL = 'https://scrapeme.live/shop/';

// Define the queries to locate the search box and fetch the stock number.
const SEARCH_QUERY = `
{
    search_products_box
}
`;

const STOCK_NUMBER_QUERY = `
{
    number_in_stock
}
`;

(async () => {
  // Set the AgentQL API key via the `configure` method.
  configure({ apiKey: process.env.AGENTQL_API_KEY });

  // Launch a headless browser using Playwright.
  const browser = await chromium.launch({ headless: true });

  // Wrap a new page to use the AgentQL API.
  const page = wrap(await browser.newPage());

  await page.goto(URL);

  let response;
  // Use queryElements() method to locate the search box from the page.
  response = await page.queryElements(SEARCH_QUERY);

  // Use Playwright's API to fill the search box and press Enter.
  await response.search_products_box.type('Charmander');
  page.keyboard.press('Enter');

  // Use queryData() method to fetch the stock number from the page.
  response = await page.queryData(STOCK_NUMBER_QUERY);
  console.log(response);

  await browser.close();
})();
