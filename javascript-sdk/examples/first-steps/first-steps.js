const { chromium } = require('playwright');
const { wrap, configure } = require('agentql');

const URL = 'https://scrapeme.live/shop';

// The AgentQL query to locate the search box element
const SEARCH_BOX_QUERY = `
{
    search_product_box
}
`;

// The AgentQL query of the data to be extracted
const PRODUCT_DATA_QUERY = `
{
    price_currency
    products[] {
        name
        price
    }
}
`;

// Other than the AgentQL query, you can also use natural language prompt to locate the element
const NATURAL_LANGUAGE_PROMPT = 'Button to display Qwilfish page';

async function main() {
  // Configure the AgentQL API key
  configure({ apiKey: 'YOUR_API_KEY' });

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();

  // Wrap the page to get access to the AgentQL's querying API
  const agentqlPage = wrap(await context.newPage());

  await agentqlPage.goto(URL);

  const productData = await _extractProductData(agentqlPage, 'fish');

  console.log(productData);

  await _addQwilfishToCart(agentqlPage);

  await browser.close();
}

async function _extractProductData(page, searchKeyWord) {
  // Find DOM element using AgentQL API's queryElements() method
  const response = await page.queryElements(SEARCH_BOX_QUERY);

  // Interact with the element using Playwright API
  await response.search_product_box.type(searchKeyWord, { delay: 200 });
  await page.keyboard.press('Enter');

  // Extract data using AgentQL API's queryData() method
  const data = await page.queryData(PRODUCT_DATA_QUERY);

  return data;
}

async function _addQwilfishToCart(page) {
  // Find DOM element using AgentQL API's getByPrompt() method
  const qwilfishPageBtn = await page.getByPrompt(NATURAL_LANGUAGE_PROMPT);

  // Interact with the element using Playwright API
  if (qwilfishPageBtn) {
    await qwilfishPageBtn.click();
  }

  // Wait for 10 seconds to see the browser action
  await page.waitForTimeout(10000);
}

main();
