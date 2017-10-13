import { asyncSetInterval, sortCompare } from './utils';

describe('the utils helper', () => {
  it('supports asyncSetInterval', (done) => {
    let callCount = 0;

    // callback takes 100ms to run
    const callback = () => new Promise(((resolve) => {
      setTimeout(() => {
        callCount += 1;
        console.log(`callCount is: ${callCount}`);
        resolve('ok');
      }, 150);
    }));

    const id = asyncSetInterval(callback, 50);
    expect(id).toBeDefined();
    console.log(`Got interval id: ${id}`);

    // after 250ms the callback should have executed twice
    setTimeout(() => {
      console.log(`After delay call count is: ${callCount}`);
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
});
