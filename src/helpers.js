const path = require('path');
const logger = require('./logger');

const TIMEOUT = 60000;

/**
 * Create a set of helpers functions to manipulate the page easily
 */
function helpers(page, timeout = TIMEOUT) {
  /**
   * Helper that get the first element on the page matching a specific selector
   */
  const getElement = (selector) => {
    logger.info(`Get element matching '${selector}' on page '${page.url()}'`);

    return page.evaluate((sel) => {
      const element = document.querySelector(sel);
      return element ? element.innerHTML : null;
    }, selector);
  };

  /**
   * Helper that get all elements on the page matching a specific selector
   */
  const getElements = (selector) => {
    logger.info(`Get elements matching '${selector}' on page '${page.url()}'`);

    return page.evaluate((sel) => {
      const elements = document.querySelectorAll(sel);
      return elements ? Object.values(elements).map(element => element.innerHTML) : null;
    }, selector);
  };

  /**
   * Helper that get container of the HTML table (either the frame if it exists, or the base page)
   */
  const getContainer = (frameId) => {
    const frames = page.frames();
    const frame = frames.find(f => f.name() === frameId);
    const container = frame || page;

    logger.info(`Use ${frame ? 'iframe' : 'page'} as table container on page '${page.url()}'`);

    return container;
  };

  /**
   * Helper that navigate to a given URL
   */
  const goto = async (url) => {
    logger.info(`Go to '${url}'`);

    await page.goto(url, {
      timeout
    });
  };

  /**
   * Helper that click on an element matching a specific selector
   */
  const clickOn = async (selector) => {
    logger.info(`Click on '${selector}' on page '${page.url()}'`);

    await page.click(selector, {
      timeout
    });
  };

  /**
   * Helper that wait for an element matching a specific selector to be loaded
   */
  const waitFor = async (selector) => {
    logger.info(`Wait for '${selector}' on page '${page.url()}'`);

    await page.waitForSelector(selector, {
      timeout
    });
  };

  /**
   * Helper that take a screenshot of the page
   */
  const screenshot = async (filename = 'screenshot') => {
    logger.info(`Screenshot '${filename}'`);

    await page.screenshot({ path: path.join(__dirname, `../screenshots/${filename}.png`) });
  };

  return {
    getElement,
    getElements,
    getContainer,
    goto,
    clickOn,
    waitFor,
    screenshot
  };
}

module.exports = helpers;
