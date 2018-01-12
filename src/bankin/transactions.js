/**
 * Transform an array of scrapped data to an JSON object
 *
 * // TODO: Account, Transaction, Amount, Currency.
 *
 * @example
 * data: ["Savings","Transaction 4700","54€"]
 * res: { Account: "Savings", Transaction: "Transaction 4700", Amount: "54€" }
 */
function toTransaction(data = []) {
  return { Account: data[0], Transaction: data[1], Amount: data[2] };
}

function toTransactions(array = []) {
  return array.map(toTransaction);
}

module.exports = {
  toTransaction,
  toTransactions
};
