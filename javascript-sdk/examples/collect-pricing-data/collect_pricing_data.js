const { wrap, configure } = require('agentql');
const { chromium } = require('playwright');
require('dotenv').config({ path: '.env.local' });

const URL = 'https://www.bestbuy.com';

async function doExtractPricingData(page) {
  //Extract pricing data from the current page.
  //Args: page (Page): The Playwright page object to interact with the browser.
  //Returns: list: The pricing data extracted from the page.

  const QUERY = `
    {
        products[] {
            name
            model
            sku
            price
        }
    }`;
  const pricingData = await page.queryData(QUERY);
  return pricingData.products || [];
}

async function searchProduct(page, product, minPrice, maxPrice) {
  const searchInput = await page.getByPrompt('the search input field');
  if (!searchInput) {
    console.log('Search input field not found.');
    return false;
  }
  await searchInput.type(product, { delay: 200 });
  await searchInput.press('Enter');

  const minPriceInput = await page.getByPrompt('the min price input field');
  if (!minPriceInput) {
    console.log('Min price input field not found.');
    return false;
  }
  await minPriceInput.fill(String(minPrice));

  const maxPriceInput = await page.getByPrompt('the max price input field');
  if (!maxPriceInput) {
    console.log('Max price input field not found.');
    return false;
  }
  await maxPriceInput.fill(String(maxPrice));
  await maxPriceInput.press('Enter');
  return true;
}

async function goToTheNextPage(page) {
  const nextPageQuery = `
    {
        pagination {
            prev_page_url
            next_page_url
        }
    }`;
  console.log('Navigating to the next page...');
  const pagination = await page.queryData(nextPageQuery);
  let nextPageUrl = pagination.pagination?.next_page_url;
  if (!nextPageUrl) {
    return false;
  }
  try {
    if (!nextPageUrl.startsWith('http')) {
      nextPageUrl = URL + nextPageUrl;
    }
    await page.goto(nextPageUrl);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function extractPricingData(page, product, minPrice, maxPrice, maxPages = 3) {
  console.log(`Searching for product: ${product} with price range: $${minPrice} - $${maxPrice}`);
  if (!(await searchProduct(page, product, minPrice, maxPrice))) {
    console.log('Failed to search for the product.');
    return [];
  }

  let currentPage = 1;
  const pricingData = [];
  while (currentPage <= maxPages) {
    console.log(`Extracting pricing data on page ${currentPage}...`);
    const pricingDataOnPage = await doExtractPricingData(page);
    console.log(`${pricingDataOnPage.length} products found`);

    pricingData.push(...pricingDataOnPage);

    if (!(await goToTheNextPage(page))) {
      console.log('No more next page.');
      break;
    }

    currentPage += 1;
  }

  return pricingData;
}
(async () => {
  configure({ apiKey: process.env.AGENTQL_API_KEY });
  const browser = await chromium.launch({ headless: false });
  const page = wrap(await browser.newPage());
  await page.goto(URL);

  const pricingData = await extractPricingData(page, 'gpu', 500, 800);
  console.log('Pricing data:', pricingData);

  await browser.close();
})();
