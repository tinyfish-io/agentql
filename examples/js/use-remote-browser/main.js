/**
 * This example demonstrates how to interact with an remote browser with AgentQL.
 */
import { wrap } from 'agentql';
import { UserAgentPreset, createBrowserSession } from 'agentql/tools';
import { chromium } from 'playwright';

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

async function getRemoteBrowserUrl() {
  // This function creates a new browser session with Windows user agent preset
  const session = await createBrowserSession(UserAgentPreset.WINDOWS);
  const cdpUrl = session.cdpUrl;
  console.log(`Remote browser URL: ${cdpUrl}`);
  console.log(`Page streaming URL: ${session.getPageStreamingUrl(0)}`);
  return cdpUrl;
}

async function runInRemoteBrowser() {
  // This function demonstrates how to open and interact with a new page using remote browser
  const browserUrl = await getRemoteBrowserUrl();

  // Connect to the browser via Chrome DevTools Protocol
  const browser = await chromium.connectOverCDP(browserUrl);

  // Create a new tab in the browser window and wrap it to get access to the AgentQL's querying API
  const page = await browser.newPage();
  const wrappedPage = await wrap(page);

  await wrappedPage.goto(URL);

  // Use queryElements() method to locate the search product box from the page
  const searchResponse = await wrappedPage.queryElements(SEARCH_QUERY);

  // Use Playwright's API to fill the search box and press Enter
  await searchResponse.search_products_box.type('Charmander');
  await wrappedPage.keyboard.press('Enter');

  // Use queryData() method to fetch the stock number from the page
  const stockResponse = await wrappedPage.queryData(STOCK_QUERY);

  console.log(stockResponse);
  await browser.close();
}

runInRemoteBrowser().catch(console.error);
