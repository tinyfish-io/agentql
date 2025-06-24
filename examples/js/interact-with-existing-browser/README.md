---
title: Use AgentQL with an already open browser
description: If you don't want to use Playwright's default browser, you can bring your own.
updated: 2025-06-24
---

# Example script: interact with existing browser

This is an example shows how to interact with existing browser by retrieving and interacting with web elements in AgentQL.

## Run the script

- [Install AgentQL SDK](https://docs.agentql.com/javascript-sdk/installation)
- Save this JavaScript file locally as **main.js**
- Close your Google Chrome application if it is open.
- If you're using **Mac**, open the terminal and run the following command:

```bash
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222
```

- If you're using **Windows**, open the Command Prompt and run the command:

```bash
chrome.exe --remote-debugging-port=9222
```

**Make sure to replace `chrome.exe` with the path to your Chrome executable if it's not already in your system's PATH.**

- In the browser window that's opened, select the Google profile you would like to use for this session.

- In **main.js**, replace variable `WEBSOCKET_URL`'s placeholder value with the actual WebSocket URL returned in terminal or command prompt. The URL should be in the format of `ws://127.0.0.1:9222/devtools/browser/387adf4c-243f-4051-a181-46798f4a46f4`.

- Run the following command from the project's folder:

```bash
node main.js
```

- If you want to learn how to work with open pages, navigate to [Scrapeme website](https://scrapeme.live/shop/Charmander/) within the browser, and use `fetch_data_from_open_website_page()` method in the script to fetch data from the page.

## Play with the query

Install the [AgentQL Debugger Chrome extension](https://docs.agentql.com/installation/chrome-extension-installation) to play with the AgentQL query. [Learn more about the AgentQL query language](https://docs.agentql.com/agentql-query/query-intro)
