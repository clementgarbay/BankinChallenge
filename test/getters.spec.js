const puppeteer = require('puppeteer');
const utils = require('../src/utils');

// TODO: disable logging when running unit tests

async function setupPage(browser) {
  const page = await browser.newPage();

  page.on('dialog', async (dialog) => {
    await dialog.dismiss();
  });

  // TODO: custom filepath
  await page.goto('file:///Users/clement/dev/bankin-scrapping/test/fixtures/index-table.htm');

  return page;
}

test('should returns "Checking" value', async () => {
  const browser = await puppeteer.launch();
  const page = await setupPage(browser);

  const element = await utils.getElement(page, 'table > tbody > tr > td');

  expect(element).toBe('Checking');

  browser.close();
});

test('should returns an array of various values', async () => {
  const browser = await puppeteer.launch();
  const page = await setupPage(browser);

  const element = await utils.getElements(page, 'table > tbody > tr > td');
  const expected = [
    'Checking',
    'Transaction 1',
    '73€',
    'Checking',
    'Transaction 2',
    '54€',
    'Checking',
    'Transaction 3',
    '87€',
    'Checking',
    'Transaction 4',
    '76€',
    'Checking',
    'Transaction 5',
    '101€',
    'Checking',
    'Transaction 6',
    '34€',
    'Checking',
    'Transaction 7',
    '43€',
    'Checking',
    'Transaction 8',
    '20€',
    'Checking',
    'Transaction 9',
    '105€',
    'Checking',
    'Transaction 10',
    '74€',
    'Checking',
    'Transaction 11',
    '75€',
    'Checking',
    'Transaction 12',
    '64€',
    'Checking',
    'Transaction 13',
    '109€',
    'Checking',
    'Transaction 14',
    '30€',
    'Checking',
    'Transaction 15',
    '95€',
    'Checking',
    'Transaction 16',
    '60€',
    'Checking',
    'Transaction 17',
    '73€',
    'Checking',
    'Transaction 18',
    '34€',
    'Checking',
    'Transaction 19',
    '71€',
    'Checking',
    'Transaction 20',
    '68€',
    'Checking',
    'Transaction 21',
    '73€',
    'Checking',
    'Transaction 22',
    '54€',
    'Checking',
    'Transaction 23',
    '71€',
    'Checking',
    'Transaction 24',
    '40€',
    'Checking',
    'Transaction 25',
    '69€',
    'Checking',
    'Transaction 26',
    '74€',
    'Checking',
    'Transaction 27',
    '71€',
    'Checking',
    'Transaction 28',
    '56€',
    'Checking',
    'Transaction 29',
    '121€',
    'Checking',
    'Transaction 30',
    '110€',
    'Checking',
    'Transaction 31',
    '119€',
    'Checking',
    'Transaction 32',
    '52€',
    'Checking',
    'Transaction 33',
    '53€',
    'Checking',
    'Transaction 34',
    '42€',
    'Checking',
    'Transaction 35',
    '107€',
    'Checking',
    'Transaction 36',
    '132€',
    'Checking',
    'Transaction 37',
    '73€',
    'Checking',
    'Transaction 38',
    '82€',
    'Checking',
    'Transaction 39',
    '79€',
    'Checking',
    'Transaction 40',
    '96€',
    'Checking',
    'Transaction 41',
    '61€',
    'Checking',
    'Transaction 42',
    '50€',
    'Checking',
    'Transaction 43',
    '99€',
    'Checking',
    'Transaction 44',
    '136€',
    'Checking',
    'Transaction 45',
    '89€',
    'Checking',
    'Transaction 46',
    '46€',
    'Checking',
    'Transaction 47',
    '131€',
    'Checking',
    'Transaction 48',
    '80€',
    'Checking',
    'Transaction 49',
    '101€',
    'Checking',
    'Transaction 50',
    '114€'
  ];

  expect(element).toEqual(expected);

  browser.close();
});
