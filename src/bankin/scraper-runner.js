/**
 * This file contains all the scraping strategy between each page
 */

const queueBuilder = require('../queue');
const Task = require('../queue/Task');
const logger = require('../logger');
const scraper = require('./scraper');

const BASE_URL = 'https://web.bankin.com/challenge/index.html';

/**
 * Main runner function which launch scraping on each page by parallelizing using a tasks queue
 *
 * @param {*} browser                 Puppeteer browser instance
 * @param {Number} nbConcurrentTasks  Number of concurrent tasks in the queue
 * @returns {Array}                   Array of Transaction
 */
async function run(browser, nbConcurrentTasks) {
  const getTransactions = scraper.getTransactionsBuilder(browser);

  let tmpTasksIds = [];

  // Create scraping tasks queue
  const queue = queueBuilder.create(getTransactions, {
    maxRetries: 2,
    cancelIfRunning: true,
    concurrent: nbConcurrentTasks
  });

  // Get transactions in the first page (to retreive the number of items per page)
  const transactions = await getTransactions(BASE_URL);
  const pageSize = transactions.length;

  // Init shared variables useful to launch next tasks
  let pageStart = (nbConcurrentTasks - 1) * pageSize;
  let isFinished = false;

  const cancelUselessTasks = (maxId) => {
    const taskIdsToCancel = tmpTasksIds.filter(id => id > maxId);

    console.log('taskIdsToCancel', taskIdsToCancel);

    taskIdsToCancel.forEach((id) => {
      logger.log(`Cancel task id ${id}`);
      queue.cancel(id);
    });
  };

  // Helper to enqueue new task
  const enqueue = (id, url) => {
    logger.info(`Create new task for url ${url}`);

    tmpTasksIds.push(id);

    queue
      .push(new Task(id, url))
      .on('finish', (taskResult) => {
        logger.info(`Task ${taskResult.task.content} succeeded`);

        tmpTasksIds = tmpTasksIds.filter(idx => idx !== id);

        const pageTransactions = taskResult.result;

        // If the page's transactions array has less results than in the first page, it's the last page
        if (pageTransactions.length < pageSize) {
          isFinished = true;
          // cancelUselessTasks(id);

          const taskIdsToCancel = tmpTasksIds.filter(idx => idx > id);

          console.log('taskIdsToCancel', taskIdsToCancel);

          taskIdsToCancel.forEach((idx) => {
            logger.log(`Cancel task id ${idx}`);
            queue.cancel(idx);
          });
        }

        // Add the page transactions to the final transactions array
        transactions.push(...pageTransactions);

        // If it's not finished, create a new task for the next page
        if (!isFinished) {
          pageStart += pageTransactions.length;
          enqueue(pageStart, `${BASE_URL}?start=${pageStart}`);
        }
      })
      .on('failed', (taskError) => {
        logger.error(`Task ${taskError.task.content} failed: ${taskError.error}`);
      });
  };

  // Create first n tasks
  [...Array(nbConcurrentTasks - 1)].forEach((_, index) => {
    const id = (index + 1) * pageSize;
    enqueue(id, `${BASE_URL}?start=${id}`);
  });

  return new Promise((resolve) => {
    // When there are no more tasks on the queue, resolve all transactions
    queue.on('drain', () => {
      const sortedTransactions = transactions.sort((t1, t2) => t1.id - t2.id);
      resolve(sortedTransactions);
    });
  });
}

module.exports = browser => ({
  run: (nbConcurrentTasks = 1) => run(browser, nbConcurrentTasks)
});
