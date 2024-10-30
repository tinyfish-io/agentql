const { wrap } = require('agentql');
const { chromium } = require('playwright');

(async () => {
  // Set the AgentQL API key via AgentQL CLI
  require('dotenv').config({ path: '.env.local' });

  const URL = 'https://www.yelp.com/';
  const EMAIL = '<USERNAME>';
  const PASSWORD = '<PASSWORD>';

  const LOG_IN_QUERY = `
  {
    log_in_btn
  }
  `;

  const CREDENTIALS_QUERY = `
  {
    sign_in_form {
      email_input
      password_input
      log_in_btn
    }
  }
  `;

  async function save_signed_in_state() {
    const browser = await chromium.launch({ headless: false });
    // Create a new page in the browser and wrap it to get access to the AgentQL's querying API
    const page = wrap(await browser.newPage());
    await page.goto(URL);

    // Use query_elements() method to locate "Log In" button on the page
    const response = await page.queryElements(LOG_IN_QUERY);
    // Use Playwright's API to click located button
    await response.log_in_btn.click();

    // Use query_elements() method to locate email, password input fields, and "Log In" button in sign-in form
    const response_credentials = await page.queryElements(CREDENTIALS_QUERY);

    // Fill the email and password input fields
    await response_credentials.sign_in_form.email_input.fill(EMAIL);
    await response_credentials.sign_in_form.password_input.fill(PASSWORD);
    await response_credentials.sign_in_form.log_in_btn.click();

    await page.waitForPageReadyState();

    // Save the signed-in state
    await page.context().storageState({ path: 'yelp_login.json' });
    await browser.close();
  }

  async function load_signed_in_state() {
    const browser = await chromium.launch({ headless: false });
    // Load the saved signed-in session by creating a new page with the saved signed-in state
    const page = wrap(await browser.newPage({ storageState: 'yelp_login.json' }));

    await page.goto(URL);

    await page.waitForPageReadyState();
    // Wait for 10 seconds to see the signed-in page
    await page.waitForTimeout(10000);

    await browser.close();
  }

  await save_signed_in_state();
  await load_signed_in_state();
})();
