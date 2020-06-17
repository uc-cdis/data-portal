import { loadHomepageChartDataFromDatasets } from './utils';


describe('the load homepage chart data flow', () => {
  it('provides accurate chunked queries', () => {
    expect(sortCompare('123', '123')).toBe(0);
    expect(sortCompare('123', '234')).toBe(-1);
    expect(sortCompare('234', '123')).toBe(1);
    expect(sortCompare('11', '2')).toBe(-1);
    expect(sortCompare(123, 123)).toBe(0);
    expect(sortCompare(123, 234)).toBe(-1);
    expect(sortCompare(234, 123)).toBe(1);
    expect(sortCompare(11, 2)).toBe(1);
  });

  it('predicts mime-type based on text shape', () => {
    expect(predictFileType(JSON.stringify({ a: 1, b: 2 }), 'unknown')).toBe('application/json');
    expect(predictFileType('a\tb\n1\t2\n', 'unknown')).toBe('text/tab-separated-values');
    expect(predictFileType('', 'unknown')).toBe('unknown');
  });
});
