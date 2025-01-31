const { wrap, configure } = require('agentql');
const { chromium } = require('playwright');

async function getPaginatedData(page, query, pages) {
  const paginatedData = [];
  for (let i = 0; i < pages; i++) {
    const data = await page.queryData(query);
    paginatedData.push(data);
    await page.goto(`https://books.toscrape.com/?page=${i + 2}`);
  }
  return paginatedData;
}

async function goToTheNextPage(page, URL) {
  const nextPageQuery = `
      {
          pagination {
              prev_page_url
              next_page_url
          }
      }`;
  console.log('Navigating to the next page...');
  const pagination = await page.queryData(nextPageQuery);
  let nextPageUrl = pagination.pagination?.next_page_url;
  if (!nextPageUrl) {
    return false;
  }
  try {
    if (!nextPageUrl.startsWith('http')) {
      nextPageUrl = URL + nextPageUrl;
    }
    await page.goto(nextPageUrl);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

(async () => {
  configure({
    apiKey: process.env.AGENTQL_API_KEY,
  });

  const QUERY = `
    {
        books[] {
            name
            price
            rating
        }
    }
    `;
  const books = [];
  const URL = 'https://books.toscrape.com/';

  const browser = await chromium.launch({ headless: false });
  const page = await wrap(await browser.newPage());

  await page.goto(URL);

  while (books.length < 50) {
    const response = await page.queryData(QUERY);
    if (response.books.length + books.length > 50) {
      books.push(...response.books.slice(0, 50 - books.length));
    } else {
      books.push(...response.books);
    }
    const paginationInfo = await getPaginatedData(page, QUERY, 1);
    if (paginationInfo.hasNextPage) {
      await goToTheNextPage(page, URL);
    }
  }

  const fs = require('fs');
  fs.writeFileSync('./books.json', JSON.stringify(books, null, 4));

  await browser.close();
})();
