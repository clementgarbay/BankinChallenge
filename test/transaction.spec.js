const Transaction = require('../src/bankin/Transaction');
const transactionAdapter = require('../src/bankin/transaction-adapter');

test('should build a Transaction object from scrapped array data', () => {
  const from = ['Savings', 'Transaction 4700', '54€'];
  const expected = new Transaction('4700', 'Savings', 'Transaction 4700', '54', '€');
  expect(transactionAdapter.fromScrapedData(from)).toEqual(expected);
});

test('should build an empty Transaction object', () => {
  const from = [];
  const expected = new Transaction('', '', '', '', '');
  expect(transactionAdapter.fromScrapedData(from)).toEqual(expected);
});

test('should returns a JSON object', () => {
  const from = new Transaction('4700', 'Savings', 'Transaction 4700', '54', '€');
  const expected = {
    account: 'Savings',
    amount: '54',
    currency: '€',
    transaction: 'Transaction 4700'
  };
  expect(from.toJson()).toEqual(expected);
});
