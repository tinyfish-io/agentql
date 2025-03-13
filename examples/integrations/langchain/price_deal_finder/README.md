# Price Deal Finder

This agent navigates to an Amazon URL that displays iPad case search results, finds an iPad case that's under $25 with at least a 4.5/5 star average review, and scrapes for information about that product.

## Run the script

- Install LangChain and LangGraph to build the agent:

```
pip install langchain langgraph
```

- Install OpenAI as the language model used for this script:

```
pip install -qU "langchain[openai]"
```

- Install AgentQL's tools:

```
pip install -U langchain-agentql
```

- Run the following command from the project's folder:

```bash
python3 price_deal_finder.py
```

## Learn more

- Learn more about AgentQL's <a href="https://python.langchain.com/docs/integrations/providers/agentql/" target="_blank">ExtractWebDataTool</a> and the <a href="https://python.langchain.com/docs/integrations/tools/playwright/" target="_blank">Playwright tools</a> used in this script
