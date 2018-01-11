const getElement = (page, selector) =>
  page.evaluate((sel) => {
    const element = document.querySelector(sel);
    return element ? element.innerHTML: null;
  }, selector);

const getElements = (page, selector) =>
  page.evaluate((sel) => {
    const elements = document.querySelectorAll(sel);
    return elements ? Object.values(elements).map(element => element.innerHTML) : null;
  }, selector);

const getContainer = (page, frameId) => {
  const frames = page.frames();
  const frame = frames.find(frame => frame.name() === frameId);
  const container = frame || page;

  return container;
}

async function clickOn(page, selector) {
  console.log(`Click on ${selector}`);
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
}