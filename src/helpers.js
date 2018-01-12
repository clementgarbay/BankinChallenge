const logger = require('./logger');
const path = require('path');

const TIMEOUT = 60000;

function helpers(page, timeout = TIMEOUT) {
  const getElement = (selector) => {
    logger.info(`Get element matching '${selector}' on page '${page.url()}'`);

    return page.evaluate((sel) => {
      const element = document.querySelector(sel);
      return element ? element.innerHTML : null;
    }, selector);
  };

  const getElements = (selector) => {
    logger.info(`Get elements matching '${selector}' on page '${page.url()}'`);

    return page.evaluate((sel) => {
      const elements = document.querySelectorAll(sel);
      return elements ? Object.values(elements).map(element => element.innerHTML) : null;
    }, selector);
  };

  const getContainer = (frameId) => {
    const frames = page.frames();
    const frame = frames.find(f => f.name() === frameId);
    const container = frame || page;

    logger.info(`Use ${frame ? 'iframe' : 'page'} as table container on page '${page.url()}'`);

    return container;
  };

  const goto = async (url) => {
    logger.info(`Go to '${url}'`);

    await page.goto(url, {
      timeout
    });
  };

  const clickOn = async (selector) => {
    logger.info(`Click on '${selector}' on page '${page.url()}'`);

    await page.click(selector, {
      timeout
    });
  };

  const waitFor = async (selector) => {
    logger.info(`Wait for '${selector}' on page '${page.url()}'`);

    await page.waitForSelector(selector, {
      timeout
    });
  };

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
