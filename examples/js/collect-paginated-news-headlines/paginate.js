async function paginate(page, query, pages) {
  const paginatedData = [];

  for (let i = 0; i < pages; i++) {
    const data = await page.queryData(query);
    paginatedData.push(data);

    if (i < pages - 1) {
      await page.goto(`https://news.ycombinator.com/?p=${i + 2}`);
    }
  }

  return paginatedData;
}

module.exports = { paginate };
