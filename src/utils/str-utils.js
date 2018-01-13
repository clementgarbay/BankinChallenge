module.exports = {
  toNumber: (str = '') => Number.parseFloat(str),
  extractNumber: (str = '') => {
    const number = str.match(/\d+/);
    return number ? number[0].trim() : '';
  },
  removeNumber: (str = '') => str.replace(/\d+/, '').trim()
};
