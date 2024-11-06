const { wrap, configure } = require('agentql');
const { chromium } = require('playwright');

const WEBSOCKET_URL = 'ws://127.0.0.1:9222/devtools/browser/494ca26b-74bf-42c0-932d-76d74a954019';

const URL = 'https://scrapeme.live/shop';

const SEARCH_QUERY = `
{
  search_products_box
}
`;

const STOCK_QUERY = `
{
  number_in_stock
}
`;

// This function demonstrates how to open and interact with a new page your local browser.
async function interactWithNewPageInLocalBrowser() {
  // Connect to the browser via Chrome DevTools Protocol.
  const browser = await chromium.connectOverCDP(WEBSOCKET_URL);

  // Create a new tab in the browser window and wrap it to get access to the AgentQL's querying API
  const page = await wrap(await browser.newPage());

  await page.goto(URL);

  // Use query_elements() method to locate the search product box from the page
  const response = await page.queryElements(SEARCH_QUERY);
  await response.search_products_box.type('Charmander');
  await page.keyboard.press('Enter');

  await page.waitForTimeout(10000);

  // Use query_data() method to fetch the stock number from the page
  const stockResponse = await page.queryData(STOCK_QUERY);
  console.log(stockResponse);
  await browser.close();
}

async function main() {
  // Set the AgentQL API key via the `configure` method.
  configure({ apiKey: process.env.AGENTQL_API_KEY });
  await interactWithNewPageInLocalBrowser();
}

main();
