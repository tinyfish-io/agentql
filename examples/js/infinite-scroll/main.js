const { wrap, configure } = require('agentql');
const { chromium } = require('playwright');

async function pressKeyAndScroll(page) {
    page.keyboard.press("End");
}

async function mouseWheelScroll(page) {
    const viewportHeight = page.evaluate(() => window.visualViewport.height);
    const bodyHeight = page.evaluate(() => document.body.scrollHeight);
    let scrollY = page.evaluate(() => window.scrollY);

    while (scrollY < bodyHeight) {
        scrollY += viewportHeight;
        page.mouse.wheel(0, viewportHeight);
        await new Promise(resolve => setTimeout(resolve, 100));
    }
}

(async () => {
    // Configure the AgentQL API key
    configure({
        apiKey: process.env.AGENTQL_API_KEY, // This is the default and can be omitted.
    });

    const browser = await chromium.launch({ headless: false });
    const page = await wrap(await browser.newPage());

    console.log("Navigating to the page...");

    await page.goto("https://infinite-scroll.com/demo/full-page/");

    const QUERY = `
    {
        page_title
        post_headers[]
    }
    `;
    
    await page.waitForLoadState();

    const numExtraPagesToLoad = 3;

    for (let i = 0; i < numExtraPagesToLoad; i++) {
        console.log(`Scrolling to the bottom of the page... (num_times = ${i + 1})`);
        await pressKeyAndScroll(page);
        await page.waitForLoadState();
        console.log("Content loaded!");
    }

    console.log("Issuing AgentQL data query...");
    const response = await page.queryData(QUERY);

    console.log("AgentQL response:", response);

    await browser.close();
    
})();
