const assert = require('node:assert/strict');
const test = require('node:test');

const { paginate } = require('./paginate');

test('does not navigate after collecting the final page', async () => {
  const visitedPages = [];
  let queryCount = 0;
  const page = {
    async queryData() {
      queryCount += 1;
      return { page: queryCount };
    },
    async goto(url) {
      visitedPages.push(url);
    },
  };

  const result = await paginate(page, '{ posts[] { title } }', 3);

  assert.deepEqual(result, [{ page: 1 }, { page: 2 }, { page: 3 }]);
  assert.deepEqual(visitedPages, [
    'https://news.ycombinator.com/?p=2',
    'https://news.ycombinator.com/?p=3',
  ]);
});
