<div align="center">

<h1>AgentQL</h1>
<h2>AI-powered web scraping and automation</h2>

<p align="center">
  <a href="https://twitter.com/agentql"><img src="https://img.shields.io/badge/Follow%20on%20X-000000?style=for-the-badge&logo=x&logoColor=white" alt="Follow on X" /></a>
  <a href="https://www.linkedin.com/company/tinyfish-ai"><img src="https://img.shields.io/badge/Follow%20on%20LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="Follow on LinkedIn" /></a>
  <a href="https://discord.gg/agentql"><img src="https://img.shields.io/badge/Join%20our%20Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white" alt="Join our Discord" /></a>
</p>

<p align="center">
  <a href="https://pypi.org/project/agentql"><img src="https://img.shields.io/pypi/v/agentql" alt="Python version" /></a>
  <a href="#repository-details-container"><img src="https://img.shields.io/github/stars/tinyfish-io/agentql" alt="GitHub Repo stars" /></a>
  <a href="#repository-details-container"><img src="https://img.shields.io/github/watchers/tinyfish-io/agentql" alt="GitHub watchers" /></a>
</p>

</div>

## What is AgentQL?

AgentQL is an AI-powered query language for scraping web sites and automating workflows. It uses natural language queries to pinpoint data and elements on any web page, including authenticated and dynamically generated content. Users can define structured data output and apply transforms within queries. AgentQL's natural language selectors find elements intuitively based on the content of the web page and work across similar web sites, self-healing as UI changes over time.

[Get started in 5 minutes with our quick start!](https://docs.agentql.com/quick-start)

### Features

- **Playwright** [AgentQL's Python SDK](https://docs.agentql.com/python-sdk/installation) and [JavaScript SDK](https://docs.agentql.com/javascript-sdk/installation) seamlessly integrates with Playwright for advanced automation and testing.
- **Cross-site compatibility** lets you use the same query across different sites with similar content.
- **Structured output** defined by the shape of your query.
- **Natural language selectors** find elements and data anywhere on a site using intuitive queries.
- **Transforms _and_ extracts** data in your queries.
- **Works on any page,** public or private, any site, any URL, even behind authentication.
- **Resiliance to UI changes** means queries work regardless of how a page's structure changes over time.

### Tools

- **[Python SDK](https://docs.agentql.com/python-sdk/installation)** for running automation and scraping scripts with AgentQL queries in Python.
- **[JavaScript SDK](https://docs.agentql.com/javascript-sdk/installation)** for running automation and scraping scripts with AgentQL queries in JavaScript.
- **[REST API](https://docs.agentql.com/rest-api/api-reference)** for executing queries without an SDK.
- **[Debugger Browser Extension](https://chromewebstore.google.com/detail/agentql-debugger/idnejmodeepdobpinkkgpkeabkabhhej)** lets you debug and finesse queries in real-time on live sites.
- **[AgentQL Query Language](https://docs.agentql.com/agentql-query/query-intro)** lets you define queries with natural language.
- **[Playground](https://playground.agentql.com/)** for playing with AgentQL lets you export python scripts and optimize queries with prompts.


## Examples

| Example Name | JavaScript | Python |
|-------------|-------------------|----------------|
| Getting Started | [Example](https://github.com/tinyfish-io/agentql/tree/main/examples/javascript/first-steps) | [Example](https://github.com/tinyfish-io/agentql/tree/main/examples/python/first_steps) |
| Close Cookie Dialog | [Example](https://github.com/tinyfish-io/agentql/tree/main/examples/js/close-cookie-dialog) | [Example](https://github.com/tinyfish-io/agentql/tree/main/examples/python/close_cookie_dialog) |
| Close Popup Windows | [Example](https://github.com/tinyfish-io/agentql/tree/main/examples/js/close-popup) | [Example](https://github.com/tinyfish-io/agentql/tree/main/examples/python/close_popup) |
| Compare Product Prices | [Example](https://github.com/tinyfish-io/agentql/tree/main/examples/js/compare-product-prices) | [Example](https://github.com/tinyfish-io/agentql/tree/main/examples/python/compare_product_prices) |
| Get Element by Prompt | [Example](https://github.com/tinyfish-io/agentql/tree/main/examples/js/get-by-prompt) | [Example](https://github.com/tinyfish-io/agentql/tree/main/examples/python/get_by_prompt) |
| Infinite Scroll | N/A | [Example](https://github.com/tinyfish-io/agentql/tree/main/examples/python/infinite_scroll) |
| External Browser Integration | [Example](https://github.com/tinyfish-io/agentql/tree/main/examples/js/interact-with-external-or-existing-browser) | [Example](https://github.com/tinyfish-io/agentql/tree/main/examples/python/interact_with_external_or_existing_browser) |
| Query List Items | [Example](https://github.com/tinyfish-io/agentql/tree/main/examples/js/list-query-usage) | [Example](https://github.com/tinyfish-io/agentql/tree/main/examples/python/list_query_usage) |
| Site Login | [Example](https://github.com/tinyfish-io/agentql/tree/main/examples/js/log-into-sites) | [Example](https://github.com/tinyfish-io/agentql/tree/main/examples/python/log_into_sites) |
| Headless Browser | [Example](https://github.com/tinyfish-io/agentql/tree/main/examples/js/run-script-in-headless-browser) | [Example](https://github.com/tinyfish-io/agentql/tree/main/examples/python/run_script_in_headless_browser) |
| Save/Load Auth Session | [Example](https://github.com/tinyfish-io/agentql/tree/main/examples/js/save-and-load-authenticated-session) | [Example](https://github.com/tinyfish-io/agentql/tree/main/examples/python/save_and_load_authenticated_session) |
| Stealth Mode | [Example](https://github.com/tinyfish-io/agentql/tree/main/examples/js/stealth-mode) | [Example](https://github.com/tinyfish-io/agentql/tree/main/examples/python/stealth_mode) |
| Wait for Page Load | [Example](https://github.com/tinyfish-io/agentql/tree/main/examples/js/wait-for-entire-page-load) | [Example](https://github.com/tinyfish-io/agentql/tree/main/examples/python/wait_for_entire_page_load) |
| E-commerce Pricing Data | [Example](https://github.com/tinyfish-io/agentql/tree/main/examples/js/collect-pricing-data) | [Example](https://github.com/tinyfish-io/agentql/tree/main/examples/python/collect_ecommerce_pricing_data) |
| Sentiment Analysis | [Example](https://github.com/tinyfish-io/agentql/tree/main/examples/js/perform-sentiment-analysis) | [Example](https://github.com/tinyfish-io/agentql/tree/main/examples/python/perform_sentiment_analysis) |
| Get XPath | [Example](https://github.com/tinyfish-io/agentql/tree/main/examples/js/xpath) | [Example](https://github.com/tinyfish-io/agentql/tree/main/examples/python/xpath) |
| Submit Form | [Example](https://github.com/tinyfish-io/agentql/tree/main/examples/js/submit-form) | [Example](https://github.com/tinyfish-io/agentql/tree/main/examples/python/submit_form) |
| Collect YouTube Comments | [Example](https://github.com/tinyfish-io/agentql/tree/main/examples/js/collect-youtube-comments) | N/A |
| Run in Google Colab | N/A | [Example](https://github.com/tinyfish-io/agentql/tree/main/examples/python/run_script_online_in_google_colab) |

For comprehensive guides and API references, check out our [official documentation](https://docs.agentql.com).

## Show Your Support 🌟

If you find AgentQL helpful, please consider giving us a star on GitHub! It helps us reach more developers and continue improving the project.

<div align="center">
  <a href="#repository-details-container"><img src="https://img.shields.io/github/stars/tinyfish-io/agentql" alt="GitHub Repo stars" /></a>
</div>

## Get in touch

For questions, feedback, or support, join our [Discord community](https://discord.gg/agentql). You can follow us on [GitHub](https://github.com/tinyfish-io/), [Twitter](https://x.com/AgentQL), and [LinkedIn](https://www.linkedin.com/company/95728009)!
