/* This example demonstrates how to run the script in a headless browser. */

const { wrap } = require('agentql');
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
  // Launch a headless browser using Playwright.
  const browser = await chromium.launch({ headless: true });
  const normalPage = await browser.newPage();
  await normalPage.goto(URL);

  // Wrap a new page instance to use with AgentQL API
  const wrappedPage = wrap(normalPage);

  // Use queryElements() method to locate the search box from the page.
  const searchResponse = await wrappedPage.queryElements(SEARCH_QUERY);

  // Use Playwright's API to fill the search box and press Enter.
  await searchResponse.search_products_box.type('Charmander');
  await normalPage.keyboard.press('Enter');

  // Use queryData() method to fetch the stock number from the page.
  const stockResponse = await wrappedPage.queryData(STOCK_NUMBER_QUERY);
  console.log(stockResponse);

  await browser.close();
})();
