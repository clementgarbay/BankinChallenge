/**
 * This file contains all the scraping strategy between each page
 */

const Queue = require('better-queue');
const logger = require('../logger');
const scrapper = require('./scrapper');

const BASE_URL = 'https://web.bankin.com/challenge/index.html';

/**
 * POJO representing a Task in the queue
 */
function Task(content) {
  this.content = content;
}
/**
 * POJO representing the result of a task processed
 */
function TaskResult(taskContent, result) {
  this.taskContent = taskContent;
  this.result = result;
}
/**
 * POJO representing the error of a task that failed
 */
function TaskError(taskContent, error) {
  this.taskContent = taskContent;
  this.error = error;
}

/**
 * Builder returning a function that allows to process a task in the queue
 */
const taskPromiseProcessorBuilder = processor => (task, done) => {
  processor(task.content)
    .then(result => done(null, new TaskResult(task.content, result)))
    .catch(error => done(new TaskError(task.content, error)));
};

/**
 * Main runner function which launch scraping on each page by parallelizing using a tasks queue
 */
async function run(browser, nbConcurrentTasks) {
  const getTransactions = scrapper.getTransactionsBuilder(browser);

  // Create scraping tasks queue
  const queue = new Queue(taskPromiseProcessorBuilder(getTransactions), {
    maxRetries: 2,
    concurrent: nbConcurrentTasks
  });

  // Get transactions in the first page (to retreive the number of items per page)
  const transactions = await getTransactions(BASE_URL);
  const pageSize = transactions.length;

  // Init shared variables useful to launch next tasks
  let pageStart = (nbConcurrentTasks - 1) * pageSize;
  let isFinished = false;

  // Helper to enqueue new task
  const enqueue = (url) => {
    logger.info(`Create new task for url ${url}`);

    queue
      .push(new Task(url))
      .on('finish', (taskResult) => {
        logger.info(`Task ${taskResult.taskContent} succeeded`);

        const pageTransactions = taskResult.result;

        // If the page's transactions array has less results than in the first page, it's the last page
        if (pageTransactions.length < pageSize) {
          isFinished = true;
        }

        // Add the page transactions to the final transactions array
        transactions.push(...pageTransactions);

        // If it's not finished, create a new task for the next page
        if (!isFinished) {
          pageStart += pageTransactions.length;
          enqueue(`${BASE_URL}?start=${pageStart}`);
        }
      })
      .on('failed', (taskError) => {
        logger.error(`Task ${taskError.taskContent} failed: ${taskError.error}`);
      });
  };

  // Create first n tasks
  [...Array(nbConcurrentTasks - 1)].forEach((_, index) =>
    enqueue(`${BASE_URL}?start=${(index + 1) * pageSize}`));

  return new Promise((resolve) => {
    // When there are no more tasks on the queue, resolve all transactions
    queue.on('drain', () => {
      resolve(transactions);
    });
  });
}

module.exports = browser => ({
  run: (nbConcurrentTasks = 1) => run(browser, nbConcurrentTasks)
});
