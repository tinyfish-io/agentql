const { chromium } = require('playwright');
const { configure, wrap } = require('agentql');

const URL = 'https://www.youtube.com/';

async function main() {
  // Configure the AgentQL API key
  configure({
    apiKey: process.env.AGENTQL_API_KEY, // This is the default and can be omitted.
  });

  const browser = await chromium.launch({ headless: false });
  const page = await wrap(await browser.newPage());
  await page.goto(URL);

  const SEARCH_QUERY = `
  {
    search_input
    search_btn
  }
  `;

  const VIDEO_QUERY = `
  {
    videos[] {
      video_link
      video_title
      channel_name
    }
  }
  `;

  const VIDEO_CONTROL_QUERY = `
  {
    play_or_pause_btn
    expand_description_btn
  }
  `;

  const DESCRIPTION_QUERY = `
  {
    description_text
  }
  `;

  const COMMENT_QUERY = `
  {
    comments[] {
      channel_name
      comment_text
    }
  }
  `;

  try {
    // search query
    const searchResponse = await page.queryElements(SEARCH_QUERY);
    await searchResponse.search_input.type('machine learning', { delay: 75 });
    await searchResponse.search_btn.click();

    // video query
    const videoResponse = await page.queryElements(VIDEO_QUERY);
    console.log(
      `Clicking Youtube Video: ${await videoResponse.videos[0].video_title.textContent()}`,
    );
    await videoResponse.videos[0].video_link.click(); // click the first youtube video

    // video control query
    const controlResponse = await page.queryElements(VIDEO_CONTROL_QUERY);
    await controlResponse.expand_description_btn.click();

    // description query
    const descriptionData = await page.queryData(DESCRIPTION_QUERY);
    console.log(`Captured the following description:\n${descriptionData.description_text}`);

    // Scroll down the page to load more comments
    for (let i = 0; i < 3; i++) {
      await page.keyboard.press('PageDown');
      await page.waitForLoadState();
    }

    // comment query
    const commentResponse = await page.queryData(COMMENT_QUERY);
    console.log(`Captured ${commentResponse.comments?.length || 0} comments!`);
  } catch (error) {
    console.error(`Found Error: ${error}`);
    throw error;
  }

  // Used only for demo purposes. It allows you to see the effect of the script.
  await page.waitForTimeout(10000);

  await browser.close();
}

main();
