const strUtils = require('../src/utils/str-utils');

test('should extract number from string', () => {
  expect(strUtils.extractNumber('Transaction 34')).toBe('34');
  expect(strUtils.extractNumber('Transaction')).toBe('');
  expect(strUtils.extractNumber('Tra43nsaction22')).toBe('43');
  expect(strUtils.extractNumber('Transaction82')).toBe('82');
  expect(strUtils.extractNumber('')).toBe('');
});

test('should remove number from string', () => {
  expect(strUtils.removeNumber('Transaction 34')).toBe('Transaction');
  expect(strUtils.removeNumber('Transaction34')).toBe('Transaction');
  expect(strUtils.removeNumber('54€')).toBe('€');
  expect(strUtils.removeNumber('€')).toBe('€');
  expect(strUtils.removeNumber('54')).toBe('');
});
