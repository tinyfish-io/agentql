const { wrap, configure } = require('agentql');
const { chromium } = require('playwright');

(async () => {
  // Set the AgentQL API key via the `configure` method.
  configure({ apiKey: 'YOUR_API_KEY' });

  const browser = await chromium.launch({ headless: false });
  const page = wrap(await browser.newPage()); // Wraps the Playwright Page to access AgentQL's features.

  // Set the URL to the desired website
  const URL = 'https://gov.uk/';
  await page.goto(URL);

  // Define the query to find elements on the page
  const QUERY = `
  {
      cookies_form {
          reject_btn
      }
  }
  `;

  // Use queryElements to fetch the cookies dialog button from the page
  const response = await page.queryElements(QUERY);

  // Check if there is a cookie-rejection button on the page and click it
  if (response.cookies_form && response.cookies_form.reject_btn) {
    await response.cookies_form.reject_btn.click();
  }

  // Wait for 10 seconds to see the effect of the script
  await page.waitForTimeout(10000);

  await browser.close();
})();
