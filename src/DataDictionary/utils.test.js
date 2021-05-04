import {
  getType,
  truncateLines,
  downloadTemplate,
  getSearchHistoryItems,
  addSearchHistoryItems,
  clearSearchHistoryItems,
} from './utils';

describe('the DataDictionaryNode', () => {
  it('knows how to extract type info from a node property', () => {
    expect(getType({ type: 'string' })).toBe('string');
    const enumProp = { enum: ['A', 'B', 'C'] };
    expect(getType(enumProp)).toEqual(['A', 'B', 'C']);
    const oneOf = getType({
      oneOf: [
        {
          enum: ['A', 'B', 'C'],
        },
        {
          oneOf: [
            {
              enum: ['D', 'E', 'F'],
            },
            {
              enum: ['G'],
            },
          ],
        },
      ],
    });
    expect(oneOf).toEqual(['A', 'B', 'C', 'D', 'E', 'F', 'G']);
    const anyOf = getType({
      anyOf: [
        {
          enum: ['A', 'B', 'C'],
        },
        {
          anyOf: [
            {
              enum: ['D', 'E', 'F'],
            },
            {
              enum: ['G'],
            },
          ],
        },
      ],
    });
    expect(anyOf).toEqual(['A', 'B', 'C', 'D', 'E', 'F', 'G']);
  });

  it('knows how to break sentences', () => {
    const testStr = 'The quick brown fox jumps over the lazy dog';
    const breakResult = [
      'The quick',
      'brown fox',
      'jumps over',
      'the lazy',
      'dog',
    ];
    expect(truncateLines(testStr)).toEqual(breakResult);
    expect(truncateLines('test')).toEqual(['test']);

    const longStr = 'testareallinglongstringwithoutspace';
    const longStrBreakResult = [
      'testareal-',
      'linglongs-',
      'tringwith-',
      'outspace',
    ];
    expect(truncateLines(longStr)).toEqual(longStrBreakResult);

    const testStrWithALongWord = 'The quick brown fox jumps over a lazyyyyyyyyyy dog';
    const withALongWordResult = [
      'The quick',
      'brown fox',
      'jumps over',
      'a lazyyyy-',
      'yyyyyy dog',
    ];
    expect(truncateLines(testStrWithALongWord)).toEqual(withALongWordResult);

    expect(truncateLines('Publication')).toEqual(['Publication']);
  });

  it('could download data dictionary template', () => {
    window.open = jest.fn();
    downloadTemplate('tsv', 'test-id');
    expect(window.open).toBeCalled();
  });

  it('knows how to get, add, and clear search history from localStorage', () => {
    const ls1 = getSearchHistoryItems();
    expect(ls1).toEqual(null);
    const item1 = {
      keywordStr: 'test keyword',
      matchedCount: 10,
    };
    const item2 = {
      keywordStr: 'test keyword2',
      matchedCount: 11,
    };
    const ls2 = addSearchHistoryItems(item1);
    expect(ls2).toEqual([item1]);
    const ls3 = addSearchHistoryItems(item2);
    expect(ls3).toEqual([item2, item1]);
    expect(clearSearchHistoryItems()).toEqual([]);
  });
});

