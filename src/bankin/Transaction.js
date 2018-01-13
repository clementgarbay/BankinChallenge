class Transation {
  constructor(id, account, transaction, amount, currency) {
    this.id = id;
    this.account = account;
    this.transaction = transaction;
    this.amount = amount;
    this.currency = currency;
  }

  toJson() {
    return {
      account: this.account,
      transaction: this.transaction,
      amount: this.amount,
      currency: this.currency
    };
  }
}

module.exports = Transation;
