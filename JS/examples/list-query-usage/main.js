const { wrap, configure } = require('agentql');
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  // Configure the AgentQL API key
  configure({
    apiKey: process.env.AGENTQL_API_KEY, // This is the default and can be omitted.
  });

  const browser = await chromium.launch({ headless: false });
  const page = await wrap(await browser.newPage()); // Wraps the Playwright Page to access AgentQL's features.

  await page.goto('https://scrapeme.live/shop/');

  const QUERY = `
  {
      products[]
      {
          product_name
          price
      }
  }
  `;

  const response = await page.queryData(QUERY);

  const scriptDir = path.dirname(__filename);
  const csvFilePath = path.join(scriptDir, 'products_data.csv');
  let csvContent = 'Products Name, Price\n';

  response.products.forEach((product) => {
    csvContent += `${product.product_name},${product.price}\n`;
  });

  fs.writeFileSync(csvFilePath, csvContent, 'utf-8');
  await browser.close();
})();
