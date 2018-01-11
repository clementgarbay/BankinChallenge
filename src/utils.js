const logger = require('./logger');

const getElement = (page, selector) => {
  logger.info(`Get element matching '${selector}' on page '${page.url()}'`);

  return page.evaluate((sel) => {
    const element = document.querySelector(sel);
    return element ? element.innerHTML : null;
  }, selector);
};

const getElements = (page, selector) => {
  logger.info(`Get elements matching '${selector}' on page '${page.url()}'`);

  return page.evaluate((sel) => {
    const elements = document.querySelectorAll(sel);
    return elements ? Object.values(elements).map(element => element.innerHTML) : null;
  }, selector);
};

const getContainer = (page, frameId) => {
  const frames = page.frames();
  const frame = frames.find(f => f.name() === frameId);
  const container = frame || page;

  logger.info(`Use ${frame ? 'iframe' : 'page'} as table container on page '${page.url()}'`);

  return container;
};

async function clickOn(page, selector) {
  logger.info(`Click on '${selector}' on page '${page.url()}'`);

  await page.click(selector);
}

async function screenshot(page, filename = 'screenshot.png') {
  await page.screenshot({ path: `./screenshots/${filename}` });
}

module.exports = {
  getContainer,
  getElement,
  getElements,
  clickOn,
  screenshot
};
