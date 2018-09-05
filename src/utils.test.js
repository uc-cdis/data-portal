import { asyncSetInterval, predictFileType, sortCompare } from './utils';


describe('the utils helper', () => {
  it.skip('supports asyncSetInterval', (done) => {
    let callCount = 0;

    // callback takes 100ms to run
    const callback = () => new Promise(((resolve) => {
      setTimeout(() => {
        callCount += 1;
        resolve('ok');
        // not here - done() is called below after 400ms ...
      }, 150);
    }));

    const id = asyncSetInterval(callback, 50);
    expect(id).toBeDefined();

    // after 250ms the callback should have executed twice
    setTimeout(() => {
      clearInterval(id);
      expect(callCount).toBe(2);
      done();
    }, 400);
  });

  it('provides sortCompare', () => {
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
