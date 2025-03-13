# Recipe Bot

This agent searches for a quick and simple oatmeal cookie recipe, navigates to a website with the recipe, collects the recipe ingredients and instructions, and writes it in a new CSV file `oatmeal_cookie_recipe.csv`.

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

- Install DuckDuckGoSearch's tools:

```
pip install -U duckduckgo-search
```

- Run the following command from the project's folder:

```bash
python3 recipe_bot.py
```

## Learn more

- Learn more about AgentQL's <a href="https://python.langchain.com/docs/integrations/providers/agentql/" target="_blank">ExtractWebDataTool</a>, the <a href="https://python.langchain.com/api_reference/community/tools/langchain_community.tools.file_management.write.WriteFileTool.html" target="_blank">WriteFileTool</a>, and the <a href="https://python.langchain.com/docs/integrations/tools/ddg/" target="_blank">DuckDuckGoSearchResults tool</a> used in this script
