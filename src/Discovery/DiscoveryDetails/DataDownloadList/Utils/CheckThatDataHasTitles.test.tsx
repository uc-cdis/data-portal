import CheckThatDataHasTitles from './CheckThatDataHasTitles'; // Import your function from the actual file

describe('validateTitle function', () => {
  it('returns true when all objects have a "title" key that evaluates to true', () => {
    const testData = [{ title: 'title', description: 'description' }, { title: 'title', description: 'description' }, { title: 'title', description: 'description' }];
    const result = CheckThatDataHasTitles(testData);
    expect(result).toBe(true);
  });

  it('returns false when any object lacks a "title" key or it does not evaluate to true', () => {
    const testData = [
      { title: 'title', description: 'description' },
      { title: false, description: 'description' },
      { title: undefined, description: 'description' },
      { otherKey: true, description: 'description' },
    ];
    const result = CheckThatDataHasTitles(testData);
    expect(result).toBe(false);
  });
});
