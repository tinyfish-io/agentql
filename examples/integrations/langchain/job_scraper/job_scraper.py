import getpass
import os

from langchain.chat_models import init_chat_model
from langchain_agentql.tools import ExtractWebDataTool
from langchain_community.tools.file_management.write import WriteFileTool
from langgraph.prebuilt import create_react_agent

# Instantiate LLM
if not os.environ.get("OPENAI_API_KEY"):
    os.environ["OPENAI_API_KEY"] = getpass.getpass("Enter API key for OpenAI: ")

model = init_chat_model("gpt-4", model_provider="openai")

# Get tools
extract_web_data = ExtractWebDataTool()
write_file = WriteFileTool()
tools = [write_file, extract_web_data]

# Create agent
agent_executor = create_react_agent(model, tools)

prompt = """
Scrape all job postings from the following page: https://www.ycombinator.com/jobs Include columns for: Job Title | Company | Location | Job URL | Employment Type (Full-time, Part-time, Contract, etc.) | Remote Eligibility (Yes/No) and write it in a new JSON file called 'job_postings.json'.
"""

# Execute agent
events = agent_executor.stream(
    {"messages": [("user", prompt)]},
    stream_mode="values",
)

for event in events:
    event["messages"][-1].pretty_print()
