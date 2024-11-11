const { randomInt } = require('crypto');
const { wrap, configure } = require('agentql');
const { chromium } = require('playwright');

const BROWSER_IGNORED_ARGS = ['--enable-automation', '--disable-extensions'];
const BROWSER_ARGS = [
  '--disable-xss-auditor',
  '--no-sandbox',
  '--disable-setuid-sandbox',
  '--disable-blink-features=AutomationControlled',
  '--disable-features=IsolateOrigins,site-per-process',
  '--disable-infobars',
];

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Safari/605.1.15',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:130.0) Gecko/20100101 Firefox/130.0',
];

const LOCATIONS = [
  ['America/New_York', { longitude: -74.006, latitude: 40.7128 }], // New York, NY
  ['America/Chicago', { longitude: -87.6298, latitude: 41.8781 }], // Chicago, IL
  ['America/Los_Angeles', { longitude: -118.2437, latitude: 34.0522 }], // Los Angeles, CA
  ['America/Denver', { longitude: -104.9903, latitude: 39.7392 }], // Denver, CO
  ['America/Phoenix', { longitude: -112.074, latitude: 33.4484 }], // Phoenix, AZ
  ['America/Anchorage', { longitude: -149.9003, latitude: 61.2181 }], // Anchorage, AK
  ['America/Detroit', { longitude: -83.0458, latitude: 42.3314 }], // Detroit, MI
  ['America/Indianapolis', { longitude: -86.1581, latitude: 39.7684 }], // Indianapolis, IN
  ['America/Boise', { longitude: -116.2023, latitude: 43.615 }], // Boise, ID
  ['America/Juneau', { longitude: -134.4197, latitude: 58.3019 }], // Juneau, AK
];

const REFERERS = ['https://www.google.com', 'https://www.bing.com', 'https://duckduckgo.com'];

const ACCEPT_LANGUAGES = ['en-US,en;q=0.9', 'en-GB,en;q=0.9', 'fr-FR,fr;q=0.9'];

const PROXIES = [
  // TODO: replace with your own proxies
  // {
  //     server: 'http://ip_server:port',
  //     username: 'proxy_username',
  //     password: 'proxy_password',
  // },
];

async function main() {
  const userAgent = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
  const headerDNT = Math.random() > 0.5 ? '0' : '1';
  const location = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
  const referer = REFERERS[Math.floor(Math.random() * REFERERS.length)];
  const acceptLanguage = ACCEPT_LANGUAGES[Math.floor(Math.random() * ACCEPT_LANGUAGES.length)];
  const proxy = PROXIES.length > 0 ? PROXIES[Math.floor(Math.random() * PROXIES.length)] : null;

  const browser = await chromium.launch({
    headless: false,
    args: BROWSER_ARGS,
    ignoreDefaultArgs: BROWSER_IGNORED_ARGS,
  });

  const context = await browser.newContext({
    proxy: proxy ?? undefined,
    locale: 'en-US,en,ru',
    timezoneId: location[0],
    extraHTTPHeaders: {
      'Accept-Language': acceptLanguage,
      Referer: referer,
      DNT: headerDNT,
      Connection: 'keep-alive',
      'Accept-Encoding': 'gzip, deflate, br',
    },
    geolocation: location[1],
    userAgent: userAgent,
    permissions: ['notifications'],
    viewport: {
      width: 1920 + randomInt(-50, 50),
      height: 1080 + randomInt(-50, 50),
    },
  });

  // Configure the AgentQL API key
  configure({
    apiKey: process.env.AGENTQL_API_KEY, // This is the default and can be omitted.
  });

  const page = await wrap(await context.newPage());
  await page.goto('https://bot.sannysoft.com/', { referer });
  await page.waitForTimeout(30000);

  await browser.close();
}

main();
