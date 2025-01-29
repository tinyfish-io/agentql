const { wrap, configure } = require('agentql');
const { chromium } = require('playwright');
const fs = require('fs');

async function paginate(page, query, pages) {
    const paginatedData = [];
    for (let i = 0; i < pages; i++) {
        const data = await page.queryData(query);
        paginatedData.push(data);
        await page.goto(`https://news.ycombinator.com/?p=${i + 2}`);
    }
    return paginatedData;
}

(async () => {
    configure({
        apiKey: process.env.AGENTQL_API_KEY,
    });

    const browser = await chromium.launch({ headless: false });
    const page = await wrap(await browser.newPage());

    const QUERY = `
    {
        posts[] {
            title
        }
    }`;

    const paginatedData = await paginate(page, QUERY, 3);

    await fs.writeFileSync(
        "./hackernews_paginated_data.json",
        JSON.stringify(paginatedData, null, 2));

    console.log("Paginated data has been saved to hackernews_paginated_data.json");

    await browser.close();
})();
