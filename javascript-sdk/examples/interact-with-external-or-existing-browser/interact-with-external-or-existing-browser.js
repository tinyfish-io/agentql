const { wrap, configure } = require('agentql');
const { chromium } = require('playwright');

const WEBSOCKET_URL = 'https://localhost:8080';

const URL = 'https://scrapeme.live/shop';

const VIATOR_TOURS_QUERY = `
{
    tours[] {
        title
        price
        length
    }
}
`;

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

// eslint-disable-next-line no-use-before-define
async function fetchDataFromOpenWebsitePage() {
  // This function demonstrates how to fetch data from open pages in your local browser.
  const browser = await chromium.connectOverCDP(WEBSOCKET_URL);

  // Get the first page from the opened browser and wrap it to get access to the AgentQL's querying API
  const page = await wrap(await browser.contexts()[0].pages()[0]);

  // Use query_data() method to fetch the data from the page
  const response = await page.queryData(STOCK_QUERY);

  console.log(response);
  await browser.close();
}

// This function demonstrates how to open and interact with a new page your local browser.
async function interactWithNewPageInLocalBrowser() {
  // Connect to the browser via Chrome DevTools Protocol.
  const browser = await chromium.connectOverCDP(WEBSOCKET_URL);

  // Create a new tab in the browser window and wrap it to get access to the AgentQL's querying API
  const page = await wrap(await browser.contexts()[0].newPage());

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

(async () => {
  // Set the AgentQL API key via the `configure` method.
  configure({ apiKey: 'your_api_key' });
  await interactWithNewPageInLocalBrowser();
})();
