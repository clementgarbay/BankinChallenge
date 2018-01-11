/**
 * This file contains all the business content and the scrapping strategy of a webpage
 */

const _ = require('lodash');
const utils = require('./utils');

const IFRAME_ID = 'fm';
const TABLE_TR_SELECTOR = 'table > tbody > tr';
const TABLE_TD_SELECTOR = `${TABLE_TR_SELECTOR} > td`;
const TABLE_TBODY_SELECTOR = 'table > tbody';
const IFRAME_SELECTOR = 'iframe';
const BUTTON_RELOAD_SELECTOR = '#btnGenerate';
const NB_COLUMNS = 3;

// Process scrapping on a webpage
async function process(page) {
  // Get table (on root page) loading promise
  const tablePagePromise = page.waitForSelector(TABLE_TBODY_SELECTOR);
  // Get iframe loading promise
  const tableIframePromise = page.waitForSelector(IFRAME_SELECTOR);

  // Wait one of both promises resolved
  await Promise.race([tablePagePromise, tableIframePromise]);

  // Get container of HTML table
  const container = utils.getContainer(page, IFRAME_ID);

  // Wait table in container
  await container.waitForSelector(TABLE_TR_SELECTOR);

  // Get all `td` elements in table
  const elements = await utils.getElements(container, TABLE_TD_SELECTOR);

  // Create an array of elements split into groups of transaction
  return _.chunk(elements, NB_COLUMNS);
}

async function scrapUrl(browser, url) {
  return new Promise(async (resolve, reject) => {
    try {
      const page = await browser.newPage();

      page.on('dialog', async (dialog) => {
        // Close dialog and click on reload button
        await dialog.dismiss();
        await page.waitForSelector(BUTTON_RELOAD_SELECTOR);
        await page.click(BUTTON_RELOAD_SELECTOR);
      });

      // Called either after a dialog dismiss or after page load
      page.on('load', async () => {
        const transactions = await process(page);
        page.close();
        resolve(transactions);
      });

      await page.goto(url);
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  process,
  scrapUrl
};
