const puppeteer = require('puppeteer');
const helpers = require('../src/puppeteer/helpers');
const expectedIndexTable = require('./expected/index-table');

async function setupPage(browser) {
  const page = await browser.newPage();

  page.on('dialog', async (dialog) => {
    await dialog.dismiss();
  });

  await page.goto(`file://${__dirname}/fixtures/index-table.htm`);

  return page;
}

test('should returns "Checking" value', async () => {
  const browser = await puppeteer.launch();
  const page = await setupPage(browser);

  const element = await helpers(page).getElement('table > tbody > tr > td');

  expect(element).toBe('Checking');

  browser.close();
});

test('should returns an array of various values', async () => {
  const browser = await puppeteer.launch();
  const page = await setupPage(browser);

  const element = await helpers(page).getElements('table > tbody > tr > td');
  const expected = expectedIndexTable;

  expect(element).toEqual(expected);

  browser.close();
});
