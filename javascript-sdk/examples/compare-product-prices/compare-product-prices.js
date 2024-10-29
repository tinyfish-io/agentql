const { wrap, configure } = require('agentql');
const { chromium } = require('playwright');

// Set the URL to the desired website
const BESTBUY_URL = 'https://www.bestbuy.com';
const EBAY_URL = 'https://www.ebay.com';
const TELQUEST_URL = 'https://www.telquestintl.com';

// Define the queries to interact with the page
const HOME_PAGE_QUERY = `
{
    search_input
    search_button
}
`;

const PRODUCT_INFO_QUERY = `
{
    product_price (for Nintendo Switch - OLed Model - w/ White Joy-Con)
}
`;

/**
 * Open the given URL in a new tab and fetch the price of the product.
 */
async function fetchPrice(context, sessionUrl) {
    // Create a page in a new tab in the broswer context and wrap it to get access to the AgentQL's querying API
    const page = wrap(await context.newPage());
    await page.goto(sessionUrl);

    // Search for the product
    await page.waitForLoadState('networkidle');
    const homeResponse = await page.queryElements(HOME_PAGE_QUERY);
    await homeResponse.search_input.fill('Nintendo Switch - OLED Model White');
    await homeResponse.search_button.click();

    // Fetch the price data from the page
    const data = await page.queryData(PRODUCT_INFO_QUERY);
    return data.product_price;
}

/**
 * Fetch prices concurrently in the same browser session from multiple websites.
 */
async function getPriceAcrossWebsites() {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();

    // Open multiple tabs in the same browser context to fetch prices concurrently
    const [bestbuyPrice, ebayPrice, telquestPrice] = await Promise.all([
        fetchPrice(context, BESTBUY_URL),
        fetchPrice(context, EBAY_URL),
        fetchPrice(context, TELQUEST_URL)
    ]);

    console.log(`
    Price at BestBuy: ${bestbuyPrice}
    Price at eBay: ${ebayPrice}
    Price at Telquest: ${telquestPrice}
    `);

    await browser.close();
}

// Set the AgentQL API key via the `configure` method.
configure({ apiKey: process.env.AGENTQL_API_KEY });

getPriceAcrossWebsites();
