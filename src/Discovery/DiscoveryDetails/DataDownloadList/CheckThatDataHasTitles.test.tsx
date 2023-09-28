import CheckThatDataHasTitles from './CheckThatDataHasTitles'; // Import your function from the actual file

describe('validateTitle function', () => {
  it('returns true when all objects have a "title" key that evaluates to true', () => {
    const testData = [{ title: true }, { title: true }, { title: true }];
    const result = CheckThatDataHasTitles(testData);
    expect(result).toBe(true);
  });

  it('returns false when any object lacks a "title" key or it does not evaluate to true', () => {
    const testData = [
      { title: true },
      { title: false },
      { title: undefined },
      { otherKey: true },
    ];
    const result = CheckThatDataHasTitles(testData);
    expect(result).toBe(false);
  });
});
