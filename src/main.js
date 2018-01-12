const puppeteer = require('puppeteer');
const scrapperRunner = require('./bankin/scrapper-runner');
const utils = require('./utils');

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    timeout: 60000
  });

  const transactions = await scrapperRunner(browser).run(10);

  // const pages = await browser.pages();
  // pages.forEach(page => page.close());
  await browser.close();

  await utils.saveAsFile('res.json', JSON.stringify(transactions, null, 2));
}

main();
