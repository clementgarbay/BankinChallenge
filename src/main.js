const puppeteer = require('puppeteer');
const _ = require('lodash');
const utils = require('./utils');

const IFRAME_ID = 'fm'
const TABLE_TR_SELECTOR = 'table > tbody > tr'
const TABLE_TD_SELECTOR = `${TABLE_TR_SELECTOR} > td`
const TABLE_TBODY_SELECTOR = 'table > tbody'
const IFRAME_TABLE_TBODY_SELECTOR = 'iframe'

async function process(page) {
  const tablePagePromise = page.waitForSelector(TABLE_TBODY_SELECTOR)
  const tableIframePromise = page.waitForSelector(IFRAME_TABLE_TBODY_SELECTOR)

  await Promise.race([tablePagePromise, tableIframePromise])
  
  const container = utils.getContainer(page, IFRAME_ID);

  await container.waitForSelector(TABLE_TR_SELECTOR);

  const elements = await utils.getElements(container, TABLE_TD_SELECTOR);
  
  return _.chunk(elements, 3)
}

function getTransactions(browser, url) {
  console.log(`Get transactions on page ${url}`)
  return new Promise(async (resolve, reject) => {
    try {
      const page = await browser.newPage();

      page.on('dialog', async dialog => {
        await dialog.dismiss()
        await page.waitForSelector('#btnGenerate')
        await page.click('#btnGenerate');
      });
  
      // Called either after a dialog dismiss or nominal case
      page.on('load', async () => {
        const transactions = await process(page)
        // page.close()
        resolve(transactions);
      });
      
      await page.goto(url);
    } catch (error) {
      reject(error)
    }
  })
}

function scrapper(browser) {
  const BASE_URL = 'https://web.bankin.com/challenge/index.html?start='

  return async function run(chunkSize = 1, start = 0) {
    console.log(`Run ${chunkSize + 1} chunks starting at ${start}`)
    try {
      const firstTransactions = await getTransactions(browser, `${BASE_URL}${start}`)
      const pageSize = firstTransactions.length

      const transactionsPagesPromises = Array(chunkSize).fill(1).map((_, index) =>
        getTransactions(browser, `${BASE_URL}${start + (index + 1) * pageSize}`)
      )

      const transactionsPages = await Promise.all(transactionsPagesPromises)
      const isFinished = transactionsPages.some(transactions => transactions.length === 0)

      const transactions = firstTransactions.concat(...transactionsPages);
      
      if (isFinished) {
        await browser.close();
        return transactions
      }

      return transactions.concat(...(await run(chunkSize, start + transactions.length)))
    } catch (error) {
      console.log(error)
    }
  }

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

  console.log(JSON.stringify(await scrapper(browser)(20)))
  
}

run()
