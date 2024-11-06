const { wrap, configure } = require('agentql');
const { chromium } = require('playwright');

// Set the URL to the desired website
const URL = 'https://scrapeme.live/shop';

// Define the queries to interact with the page
const HOME_PAGE_QUERY = `
{
    search_products_input
}
`;

/**
 * Open the given URL in a new tab and fetch the price of the product.
 */
async function fetchPrice(context, sessionUrl, productName) {
  // Create a page in a new tab in the broswer context and wrap it to get access to the AgentQL's querying API
  const page = await wrap(await context.newPage());
  await page.goto(sessionUrl);

  // Search for the product
  const homeResponse = await page.queryElements(HOME_PAGE_QUERY);
  await homeResponse.search_products_input.fill(productName);
  await homeResponse.search_products_input.press('Enter');

  const PRODUCT_INFO_QUERY = `
  {
      product_price (${productName})
  }
  `;

  // Fetch the price data from the page
  const data = await page.queryData(PRODUCT_INFO_QUERY);
  return data.product_price;
}

/**
 * Fetch prices concurrently in the same browser session from multiple websites.
 */
async function getPriceAcrossWebsites() {
  // Configure the AgentQL API key
  configure({
    apiKey: process.env.AGENTQL_API_KEY, // This is the default and can be omitted.
  });
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();

  // Open multiple tabs in the same browser context to fetch prices concurrently
  const [charmanderPrice, venusaurPrice, charizardPrice] = await Promise.all([
    fetchPrice(context, URL, 'Charmander'),
    fetchPrice(context, URL, 'Venusaur'),
    fetchPrice(context, URL, 'Charizard'),
  ]);

  console.log(
    `
    Charmander price: ${charmanderPrice}
    Venusaur price: ${venusaurPrice}
    Charizard price: ${charizardPrice}
    `,
  );

  await browser.close();
}

getPriceAcrossWebsites();
