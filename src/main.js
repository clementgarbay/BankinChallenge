const puppeteer = require('puppeteer');
const logger = require('./logger');
const scrapper = require('./bankin-scrapper');

async function getTransactions(browser, url) {
  logger.log(`Get transactions on page ${url}`);

  return scrapper.scrapUrl(browser, url);
}

function init(browser) {
  const BASE_URL = 'https://web.bankin.com/challenge/index.html?start=';

  return async function run(chunkSize = 1, start = 0) {
    logger.info(`Run ${chunkSize + 1} chunks starting at ${start}`);

    try {
      const firstTransactions = await getTransactions(browser, `${BASE_URL}${start}`);
      const pageSize = firstTransactions.length;

      const transactionsPagesPromises = Array(chunkSize)
        .fill(1)
        .map((val, index) => {
          const nextStart = start + (index + 1) * pageSize;
          return getTransactions(browser, `${BASE_URL}${nextStart}`);
        });

      const transactionsPages = await Promise.all(transactionsPagesPromises);
      const isFinished = transactionsPages.some(transactions => transactions.length === 0);

      const transactions = firstTransactions.concat(...transactionsPages);

      if (isFinished) {
        await browser.close();
        return transactions;
      }

      return transactions.concat(...(await run(chunkSize, start + transactions.length)));
    } catch (error) {
      logger.error(error);
    }
  };

  // Without parallelization
  // return async function run(start = 0) {
  //   const transactions = await getTransactions(browser, `${BASE_URL}${start}`)
  //   if (transactions.length === 0 || start === 200) {
  //     await browser.close();
  //     return transactions
  //   }
  //   transactions.push(...(await run(start + transactions.length)))
  //   return transactions
  // }
}

async function run() {
  const browser = await puppeteer.launch({
    headless: true
  });

  console.log(JSON.stringify(await init(browser)(20)));
}

run();
