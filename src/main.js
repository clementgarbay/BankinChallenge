const puppeteer = require('puppeteer');
const path = require('path');
const scrapperRunner = require('./bankin/scrapper-runner');
const utils = require('./utils');

async function main() {
  // Create browser (chrome headless)
  const browser = await puppeteer.launch();

  // Run scrapper
  const transactions = await scrapperRunner(browser).run(8);

  // Close browser
  await browser.close();

  // Save transactions in JSON file
  await utils.saveAsFile(
    path.join(__dirname, '../res'),
    'res.json',
    JSON.stringify(transactions, null, 2)
  );
}

main();
