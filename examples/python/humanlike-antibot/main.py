import random
import time

from playwright.sync_api import ElementHandle, Page, sync_playwright

import agentql


def random_mouse_movement(page: Page):
    for _ in range(10):
        page.mouse.move(random.randint(0, 1000), random.randint(0, 1000))
        time.sleep(random.uniform(0.1, 0.5))


def random_click(page: Page, element: ElementHandle):
    box = element.bounding_box()
    page.mouse.move(box["x"] + box["width"] / 2, box["y"] + box["height"] / 2)
    page.mouse.click(box["x"] + box["width"] / 2, box["y"] + box["height"] / 2)


def random_scroll(page: Page):
    page.mouse.wheel(0, 1000)
    time.sleep(random.uniform(0.1, 0.5))


with sync_playwright() as playwright:
    # Launch browser with proxy settings
    browser = playwright.chromium.launch(headless=False)

    # Wrap browser with AgentQL
    page = agentql.wrap(browser.new_page())
    page.goto("https://duckduckgo.com/")

    # Type "AgentQL" into the search box keystroke by keystroke
    page.get_by_prompt("the search bar").press_sequentially("AgentQL")

    # Click the search button in a random manner
    random_click(page, page.get_by_prompt("the search button"))

    for _ in range(5):
        random_mouse_movement(page)
        random_scroll(page)
