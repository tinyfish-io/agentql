// This example demonstrates how to leverage get_by_prompt method to interact with element by prompt text.

const { wrap, configure } = require('agentql');
const { chromium } = require('playwright');

// Set the URL to the desired website
const URL = 'https://thinking-tester-contact-list.herokuapp.com/';

async function main() {
  // Configure the AgentQL API key
  configure({
    apiKey: process.env.AGENTQL_API_KEY, // This is the default and can be omitted.
  });

  const browser = await chromium.launch({ headless: false });

  // Wrap the page to get access to the AgentQL's querying API
  const page = await wrap(await browser.newPage());

  // Navigate to the URL
  await page.goto(URL);

  // Get the sign up button by the prompt text
  const signUpBtn = await page.getByPrompt('Sign up button');

  // Click the sign up button if it exists
  if (signUpBtn) {
    await signUpBtn.click();
  }

  // Used only for demo purposes. It allows you to see the effect of the script.
  await page.waitForTimeout(10000);

  await browser.close();
}

main();
