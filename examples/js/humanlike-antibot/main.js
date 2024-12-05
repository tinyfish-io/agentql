const { wrap, configure } = require('agentql');
const { chromium } = require('playwright');

async function randomMouseMovement(page) {
    for (let i = 0; i < 10; i++) {
        await page.mouse.move(
            Math.floor(Math.random() * 1000),
            Math.floor(Math.random() * 1000)
        );
        await new Promise(r => setTimeout(r, Math.random() * 400 + 100));
    }
}

async function randomClick(page, element) {
    const box = await element.boundingBox();
    await page.mouse.move(
        box.x + box.width / 2,
        box.y + box.height / 2
    );
    await page.mouse.click(
        box.x + box.width / 2,
        box.y + box.height / 2
    );
}

async function randomScroll(page) {
    await page.mouse.wheel(0, 1000);
    await new Promise(r => setTimeout(r, Math.random() * 400 + 100));
}

async function main() {
    // Configure the AgentQL API key
    configure({
      apiKey: process.env.AGENTQL_API_KEY, // This is the default and can be omitted.
    });
  
    // Launch browser with proxy settings
    const browser = await chromium.launch({ headless: false });

    // Wrap browser with AgentQL
    const page = await wrap(await browser.newPage());
    await page.goto('https://duckduckgo.com/');

    // Type "AgentQL" into the search box keystroke by keystroke
    const searchBar = await page.getByPrompt('the search bar');
    searchBar.pressSequentially('AgentQL');

    // Click the search button in a random manner
    await randomClick(page, await page.getByPrompt('the search button'));

    for (let i = 0; i < 5; i++) {
        await randomMouseMovement(page);
        await randomScroll(page);
    }

    await browser.close();
}

main().catch(console.error);
