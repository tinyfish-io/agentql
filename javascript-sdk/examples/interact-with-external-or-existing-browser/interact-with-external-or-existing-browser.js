const { wrap, configure } = require('agentql');
const { chromium } = require('playwright');

const WEBSOCKET_URL = "ws://127.0.0.1:9222/devtools/browser/28663a7e-7178-4acc-8123-480605f26dc52"

const URL = "https://scrapeme.live/shop";

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

async function interactWithNewPageInLocalBrowser() {
  //"""This function demonstrates how to open and interact with a new page your local browser."""
  const browser = await chromium.connectOverCDP(WEBSOCKET_URL);
  const page = wrap(await browser.contexts()[0].newPage());

  await page.goto(URL);
  
  const response = await page.queryElements(SEARCH_QUERY);
  await response.search_products_box.type("Charmander");
  await page.keyboard.press("Enter");

  await page.waitForTimeout(10000);

  const stockResponse = await page.queryData(STOCK_QUERY);
  console.log(stockResponse);
}

(async () => {
  // Set the AgentQL API key via the `configure` method.
  configure({ apiKey: 'YOUR_API_KEY' });

  await interactWithNewPageInLocalBrowser();
})();