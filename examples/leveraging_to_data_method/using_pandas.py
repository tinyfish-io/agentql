# This example scrapes prices from nike.com using a simple query and the to_data method. It then uses pandas to output a table to a file
# It then uses pandas to output a table to a file


import agentql
import json
import pandas as pd
from agentql.ext.playwright.sync_api import PlaywrightWebDriver


URL = "https://www.nike.com/w/mens-shoes-nik1zy7ok"

driver = PlaywrightWebDriver(headless=False)
session = agentql.start_session(URL, web_driver=driver)

QUERY = """
{
    shoes[]{
        title
        price
        colors
    }
    
}
"""
response = session.query(QUERY)
data = response.to_data()

#Let's dump the data out to a json file for us to use.

with open("nike.json", "w") as outfile:
    json.dump(data, outfile)

#We use pandas to take the dictand convert it to a dataframe
df = pd.DataFrame.from_dict(data)

#This makes it super simple to print a table
print(df.to_string())

#We can even write that table to a file                                                                  
with open('nikeTable.txt', 'a') as f:
    f.write(df.to_string())

session.stop()
