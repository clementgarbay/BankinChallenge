const strUtils = require('../utils/str-utils');
const Transation = require('./Transaction');

/**
 * Transform an array of scraped data to a Transation object
 *
 * @param {Array} data  Row transaction (i.e. ["Savings","Transaction 4700","54€"])
 * @returns Corresponding Transation object
 */
const fromScrapedData = (data = []) =>
  new Transation(
    strUtils.extractNumber(data[1]),
    data[0] || '',
    data[1] || '',
    strUtils.extractNumber(data[2]),
    strUtils.removeNumber(data[2])
  );

module.exports = { fromScrapedData };
