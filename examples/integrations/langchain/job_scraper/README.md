# Job Scraper

This agent scrapes all of the job postings in https://www.ycombinator.com/jobs and writes it in a new json file `job_postings.json`.

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
python3 job_scraper.py
```

## Learn more

- Learn more about AgentQL's <a href="https://python.langchain.com/docs/integrations/providers/agentql/" target="_blank">ExtractWebDataTool</a> and the <a href="https://python.langchain.com/api_reference/community/tools/langchain_community.tools.file_management.write.WriteFileTool.html" target="_blank">WriteFileTool</a> used in this script
