const puppeteer = require('puppeteer');
const path = require('path');
const scrapperRunner = require('./bankin/scrapper-runner');
const fsUtils = require('./utils/fs-utils');

async function main() {
  // Create browser instance (chrome headless)
  const browser = await puppeteer.launch();

  // Run scrapper
  const transactions = await scrapperRunner(browser).run(10);

  // Close browser
  await browser.close();

  // Save transactions in JSON file
  await fsUtils.saveAsFile(
    path.join(__dirname, '../res'),
    'res.json',
    JSON.stringify(transactions.map(transaction => transaction.toJson()), null, 2)
  );
}

main();
