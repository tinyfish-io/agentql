const { wrap, configure } = require('agentql');
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

// Define the query to interact with the page
const query = `
{
    items(might be aritcles, posts, tweets)[]
    {
        published_date(convert to XX/XX/XXXX format)
        entry(title or post if no title is available)
        author(person's name; return "n/a" if not available)
        outlet(the original platform it is posted on; if no platform is listed, use the root domain of the url)
        url
    }
}
`;

// Set URLs to the desired websites
const websiteUrls = [
    'https://bsky.app/search?q=agents+for+the+web',
    'https://dev.to/search?q=agents%20for%20the%20web&sort_by=published_at&sort_direction=desc',
    'https://hn.algolia.com/?dateRange=last24h&page=0&prefix=false&query=agents%20for%20the%20web&sort=byDate&type=story',
    'https://duckduckgo.com/?q=agents+for+the+web&t=h_&iar=news&ia=news'
];

// Get the directory of the current script and create path to the csv file
const scriptDir = path.dirname(__filename);
const csvFilePath = path.join(scriptDir, 'news_headlines.csv');

async function fetchData(context, sessionUrl) {
    const page = await wrap(await context.newPage());
    await page.goto(sessionUrl);

    const data = await page.queryData(query);

    // Prepare new data
    const newLines = data.items.map(item => {
        const cleanEntry = item.entry.replace(/\|/g, '');
        return `${item.published_date} | ${cleanEntry} | ${item.url} | ${item.outlet} | ${item.author}\n`;
    });

    // Handle file writing with proper header management
    if (!fs.existsSync(csvFilePath)) {
        // New file - write header and data
        fs.writeFileSync(csvFilePath, 'Posted | Entry | URL | Platform | Author\n', 'utf-8');
        fs.appendFileSync(csvFilePath, newLines.join(''), 'utf-8');
    } else {
        // File exists - append new data while preserving existing content
        fs.appendFileSync(csvFilePath, newLines.join(''), 'utf-8');
    }

    console.log(`Fetched items from ${sessionUrl}...`);
}

(async () => {
    // Configure the AgentQL API key
    configure({
        apiKey: process.env.AGENTQL_API_KEY, // This is the default and can be omitted
    });

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();

    try {
        // Process all URLs concurrently
        await Promise.all(websiteUrls.map(url => fetchData(context, url)));
        console.log(`All done! CSV is here: ${csvFilePath}...`);
    } finally {
        await browser.close();
    }
})();
