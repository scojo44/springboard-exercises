const {mean, median, mode, all, toIntArray} = require('./stats-calc');

describe('Statistics Function Tests', () => {
  let goodNums;
  
  beforeAll(() => {
    goodNums = [5,3,44,17,4,9,4,44,6,3,18,99,4];
  })

  test('Mean gets the average value', () => {
    expect(mean(goodNums)).toBe(20);
  })

  test('Median gets the middle number', () => {
    expect(median(goodNums)).toBe(6);
  })

  test('Mode gets the most frequent number', () => {
    expect(mode(goodNums)).toBe(4);
  })

  test('All gets all three results', () => {
    expect(all(goodNums)).toEqual({
      mean: 20,
      median: 6,
      mode: 4
    });
  })
})

describe('Support Function Tests', () => {
  test('toIntArray converts an array of integers as strings to real integers', () => {
    expect(toIntArray('1,2,3')).toEqual([1,2,3]);
  })
})