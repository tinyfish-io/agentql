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

  await page.goto(
    'https://www.google.com/maps/search/boba+tea/@37.4400289,-122.1653309,14z/data=!3m1!4b1?entry=ttu&g_ep=EgoyMDI1MDIxMS4wIKXMDSoASAFQAw%3D%3D',
  );

  const QUERY = `
  {
    listings[] {
        name
        rating(in stars)
        description(if not available, use "n/a")
        order_link(if not available, use "n/a")
        take_out_link(if not available, use "n/a")
        address
        hours
    }
  }
  `;

  const response = await page.queryData(QUERY);

  const scriptDir = path.dirname(__filename);
  const csvFilePath = path.join(scriptDir, 'map_data.csv');
  let csvContent = 'Name, Rating, Description, Order Link, Take Out Link, Address, Hours\n';

  response.listings.forEach((listing) => {
    csvContent += `${listing.name},${listing.rating},${listing.description},${listing.order_link},${listing.take_out_link},${listing.address},${listing.hours}\n`;
  });

  fs.writeFileSync(csvFilePath, csvContent, 'utf-8');
  await browser.close();
})();
