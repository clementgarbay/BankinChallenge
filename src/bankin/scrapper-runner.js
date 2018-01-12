const Queue = require('queue');
const logger = require('../logger');
const scrapper = require('./scrapper');

const BASE_URL = 'https://web.bankin.com/challenge/index.html';

async function run(browser, nbJobs) {
  return new Promise(async (resolve, reject) => {
    // Create queue
    const queue = Queue({ results: [] });

    // Helper to enqueue new job
    const enqueue = (url) => {
      logger.info(`Create new job for url ${url}`);

      queue.push(async () => ({
        url,
        transactions: await scrapper.getTransactions(browser, url)
      }));
    };

    // Get transactions of the first page (to retreive the number of items per page)
    const transactions = await scrapper.getTransactions(browser, BASE_URL);
    const pageSize = transactions.length;

    // Init shared variables for the next jobs
    let start = (nbJobs - 1) * pageSize;
    let isFinished = false;

    // Create first n jobs
    Array(nbJobs - 1)
      .fill(1)
      .forEach((ignored, index) => enqueue(`${BASE_URL}?start=${(index + 1) * pageSize}`));

    queue.on('success', (result) => {
      logger.info(`Job ${result.url} succeeded`);

      const pageTransactions = result.transactions;

      // If page's transactions array has less results than in the first page, it is the last page
      if (pageTransactions.length < pageSize) {
        //  || start === 1000
        isFinished = true;
      }

      // Add page's transactions result to the final transactions array
      transactions.push(...pageTransactions);

      // If it's not finished, create a new job for the next page
      if (!isFinished) {
        start += pageTransactions.length;
        enqueue(`${BASE_URL}?start=${start}`);
      }
    });

    queue.on('error', (error) => {
      logger.error(error);
      reject(transactions);
    });

    queue.on('end', () => {
      resolve(transactions);
    });

    // Begin processing
    queue.start();

    // (error, results) => {
    //   if (error) reject(error);
    //   console.log('results', results);
    // }
  });
}

module.exports = browser => ({
  run: (nbJobs = 1) => run(browser, nbJobs)
});
