import initialTableSort from './initialTableSort';

describe('sortObjectsByFinishedAt', () => {
  it('should sort objects correctly', () => {
    const input = [
      { finishedAt: '2023-08-01T12:00:00Z' },
      { finishedAt: null },
      { finishedAt: '2023-08-03T08:00:00Z' },
      { finishedAt: '2023-08-02T15:30:00Z' },
      { finishedAt: null },
    ];

    const expectedOutput = [
      { finishedAt: null },
      { finishedAt: null },
      { finishedAt: '2023-08-03T08:00:00Z' },
      { finishedAt: '2023-08-02T15:30:00Z' },
      { finishedAt: '2023-08-01T12:00:00Z' },
    ];

    const sortedArray = initialTableSort(input);
    expect(sortedArray).toEqual(expectedOutput);
  });

  it('should return the same array if all finishedAt are null', () => {
    const input = [
      { finishedAt: null },
      { finishedAt: null },
      { finishedAt: null },
    ];

    const expectedOutput = [
      { finishedAt: null },
      { finishedAt: null },
      { finishedAt: null },
    ];

    const sortedArray = initialTableSort(input);
    expect(sortedArray).toEqual(expectedOutput);
  });

  it('should return the same array if array is empty', () => {
    const input = [];
    const sortedArray = initialTableSort(input);
    expect(sortedArray).toEqual(input);
  });
});
