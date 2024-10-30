const { wrap, configure } = require('agentql');
const { chromium } = require('playwright');

(async () => {
  configure({ apiKey: 'YOUR_API_KEY' });

  const browser = await chromium.launch({ headless: false });
  const page = wrap(await browser.newPage());

  await page.goto('https://formsmarts.com/html-form-example');

  const form_query = `
        {
            first_name
            last_name
            email
            subject_of_inquiry
            inquiry_text_box
            submit_btn
        }
        `;

  const response = await page.queryElements(form_query);

  await response.first_name.type('John');
  await response.last_name.type('Doe');
  await response.email.type('john.doe@example.com');
  await response.subject_of_inquiry.selectOption({ label: 'Sales Inquiry' });
  await response.inquiry_text_box.fill("I want to learn more about AgentQL");
  await response.submit_btn.click();

  const confirm_query = `
        {
            confirmation_btn
        }
        `;
  const confirm_response = await page.queryElements(confirm_query);
  await confirm_response.confirmation_btn.click();
  await page.waitForTimeout(9000);
  console.log('Form submitted successfully!');

  await browser.close();
})();
