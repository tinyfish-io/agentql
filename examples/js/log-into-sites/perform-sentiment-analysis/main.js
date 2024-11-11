/* This example demonstrates how to perform sentiment analysis on YouTube comments with AgentQL and OpenAI's GPT-3.5 model. */

const { wrap, configure } = require('agentql');
const { chromium } = require('playwright');

// Import the OpenAI API client.
const { OpenAI } = require('openai/index.mjs');

// Define the URL of the page to scrape.
const URL = 'https://www.youtube.com/watch?v=JfM1mr2bCuk';

// Define a query to interact with the page.
const QUERY = `
{
  video_title
  video_channel
  comments[] {
    comment_text
    author
  }
}
`;

async function getComments() {
  // Configure the AgentQL API key
  configure({
    apiKey: process.env.AGENTQL_API_KEY, // This is the default and can be omitted.
  });

  // Launch a headless browser using Playwright.
  const browser = await chromium.launch({ headless: false });

  // Create a new page in the browser and wrap it to get access to the AgentQL's querying API
  const page = await wrap(await browser.newPage());
  await page.goto(URL);

  for (let i = 0; i < 5; i++) {
    // Scroll down the page to load more comments.
    await page.waitForPageReadyState();

    // Scroll down the page to load more comments
    await page.keyboard.press('PageDown');
  }

  // Use queryData() method to fetch the video information from the page.
  const response = await page.queryData(QUERY);

  // Close the browser
  await browser.close();

  return response;
}

async function performSentimentAnalysis(comments) {
  // User message construction
  let USER_MESSAGE =
    'These are the comments on the video. I am trying to understand the sentiment of the comments.';

  // Append each comment's text to USER_MESSAGE
  comments.comments.forEach((comment) => {
    USER_MESSAGE += comment.comment_text;
  });

  // Define the system message
  const SYSTEM_MESSAGE = `You are an expert in understanding social media analytics and specialize in analyzing the sentiment of comments.
  Please find the comments on the video as follows:
  `;

  // Append request for a summary and takeaways
  USER_MESSAGE +=
    ' Could you please provide a summary of the comments on the video. Additionally, just give only 3 takeaways which would be important for me as the creator of the video.';

  // Initialize OpenAI client
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: SYSTEM_MESSAGE },
        { role: 'user', content: USER_MESSAGE },
      ],
    });

    // Return the content of the first completion choice
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error during API call:', error);
    throw error;
  }
}

async function main() {
  const comments = await getComments();
  const summary = await performSentimentAnalysis(comments);
  console.log(summary);
}

main();
