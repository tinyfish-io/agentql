const { chromium } = require('playwright');
const { wrap, configure } = require('agentql');

// Set URLs to the desired websites
const WEBSITE_URL_1 = "<Replace with the correct url>";
const WEBSITE_URL_2 = "<Replace with the correct url>";
const WEBSITE_URL_3 = "<Replace with the correct url>";

async function main() {
  // Configure the AgentQL API key
  configure({ apiKey: process.env.AGENTQL_API_KEY });

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();

  // Open multiple tabs in the same browser context to fetch data concurrently
  await Promise.all([
    fetchData(context, WEBSITE_URL_1),
    fetchData(context, WEBSITE_URL_2),
    fetchData(context, WEBSITE_URL_3),
  ]);

  await browser.close();
}

async function fetchData(context, sessionUrl) {
  // Create a page in a new tab in the browser context and wrap it to get access to the AgentQL's querying API
  const page = await wrap(await context.newPage());
  await page.goto(sessionUrl);

  // Update the query to locate the desired element on the page
  const elementsQuery = `
  {
      search_input
      search_btn
  }
  `;

  // Locate desired web elements using AgentQL's queryElements() method
  const response = await page.queryElements(elementsQuery);
  // Update to use the actual query terms to interact with the elements
  await response.search_input.fill("<Replace with needed search query>");
  await response.search_btn.click();

  // Update the query to fetch the desired data from the page
  const dataQuery = `
  {
      products[] {
          name
          price
      }
  }
  `;

  // Fetch the data from the page using AgentQL's queryData() method
  const data = await page.queryData(dataQuery);
  // Update to use the actual keys corresponding to query terms
  console.log(`Prices fetched from ${sessionUrl}:`);
  for (const product of data.products) {
    console.log(`Product: ${product.name}, Price: ${product.price}`);
  }
}

main();
