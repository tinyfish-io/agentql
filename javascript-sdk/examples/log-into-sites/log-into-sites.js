const { chromium } = require('playwright');
const { wrap } = require('agentql');

// Set the URL to the desired website
const URL = 'https://practicetestautomation.com/practice-test-login/';

const LOGIN_QUERY = `
{
    username_field
    password_field
    submit_btn
}
`;

async function main() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();

  // Wrap the page to get access to the AgentQL's querying API
  const page = wrap(await context.newPage());

  // Navigate to the URL
  await page.goto(URL);

  // Get the username and password fields
  const response = await page.queryElements(LOGIN_QUERY);

  // Fill the username and password fields
  await response.username_field.fill('student');
  await response.password_field.fill('Password123');

  // Click the submit button
  await response.submit_btn.click();

  // Wait for 10 seconds to see the browser action
  await page.waitForTimeout(10000);

  await browser.close();
}

main();
