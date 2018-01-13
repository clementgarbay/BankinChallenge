/**
 * This file contains all the business content and the scrapping strategy of one webpage
 */

const chunk = require('lodash/chunk');
const logger = require('../logger');
const helpers = require('../helpers');
const transactions = require('./transactions');

const IFRAME_ID = 'fm';
const TABLE_TR_SELECTOR = 'table > tbody > tr';
const TABLE_TD_SELECTOR = `${TABLE_TR_SELECTOR} > td`;
const TABLE_TBODY_SELECTOR = 'table > tbody';
const IFRAME_SELECTOR = 'iframe';
const BUTTON_RELOAD_SELECTOR = '#btnGenerate';
const NB_COLUMNS = 3;

// Process scrapping on a webpage
async function process(page) {
  const pageHelpers = helpers(page);

  // Get table (on root page) loading promise
  const tablePagePromise = pageHelpers.waitFor(TABLE_TBODY_SELECTOR);
  // Get iframe loading promise
  const tableIframePromise = pageHelpers.waitFor(IFRAME_SELECTOR);

  // Wait one of both promises resolved
  await Promise.race([tablePagePromise, tableIframePromise]);

  // Get container (the page or the iframe) of HTML table
  const container = pageHelpers.getContainer(IFRAME_ID);
  const containerHelpers = helpers(container);

  // Wait table in container
  await containerHelpers.waitFor(TABLE_TR_SELECTOR);

  // Get all `td` elements in table
  const elements = await containerHelpers.getElements(TABLE_TD_SELECTOR);

  // Create an array of elements split into groups of transactions
  return chunk(elements, NB_COLUMNS);
}

// Get transactions on a specific URL
async function getTransactions(browser, url) {
  logger.log(`Get transactions on page ${url}`);

  return new Promise(async (resolve, reject) => {
    const page = await browser.newPage();
    const pageHelpers = helpers(page);

    try {
      page.on('dialog', async (dialog) => {
        // When dialog appears, close it and click on reload button
        await dialog.dismiss();
        await pageHelpers.waitFor(BUTTON_RELOAD_SELECTOR);
        await pageHelpers.clickOn(BUTTON_RELOAD_SELECTOR);
      });

      // Called either after a dialog dismiss or after page load
      page.on('load', async () => {
        const res = await process(page);
        await page.close();
        resolve(transactions.toTransactions(res));
      });

      await pageHelpers.goto(url);
    } catch (error) {
      logger.error(`Error on page ${url}: ${error}`);

      reject(error);
    }
  });
}

module.exports = {
  getTransactionsBuilder: browser => url => getTransactions(browser, url)
};
