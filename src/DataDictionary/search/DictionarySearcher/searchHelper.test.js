import {
  prepareSearchData,
  searchKeyword,
  getSearchSummary,
  ERR_KEYWORD_TOO_SHORT,
  ERR_KEYWORD_TOO_LONG,
} from './searchHelper';

describe('dictionary search helper', () => {
  const dictionary = {
    a1: {
      title: 'test',
      id: 'a1',
      category: 'A',
      description: 'whatever',
      properties: [
        {
          name: 'test',
          description: 'test description',
          type: 'test type',
        },
      ],
    },
    a2: {
      title: 'a2',
      id: 'a2',
      category: 'A',
      description: 'whatever',
      properties: [],
    },
    b1: {
      title: 'b1',
      id: 'b1',
      category: 'B',
      description: 'whatever',
      properties: [],
    },
    b2: {
      title: 'b2',
      id: 'b2',
      category: 'B',
      description: 'whatever',
      properties: [],
    },
    b3: {
      title: 'b3',
      id: 'b3',
      category: 'B',
      description: 'whatever',
      properties: [],
    },
    b4: {
      title: 'b4',
      id: 'b4',
      category: 'B',
      description: 'whatever',
      properties: [],
    },
  };
  const searchData = prepareSearchData(dictionary);

  it('can search', () => {
    const { result } = searchKeyword(searchData, 'test');
    expect(result.length).toBeGreaterThan(0);
    const summary = getSearchSummary(result);
    expect(summary.matchedPropertiesCount).toBeGreaterThan(0);
    expect(summary.matchedNodeNameAndDescriptionsCount).toBeGreaterThan(0);
    expect(summary.matchedNodeIDsInNameAndDescription.includes('a1')).toBe(true);
    expect(summary.matchedNodeIDsInProperties.includes('a1')).toBe(true);
    expect(summary.generalMatchedNodeIDs.includes('a1')).toBe(true);
  });

  it('can output error if keyword too short', () => {
    const { result, errorMsg } = searchKeyword(searchData, 't');
    expect(result).toEqual([]);
    expect(errorMsg).toEqual(ERR_KEYWORD_TOO_SHORT);
  });

  it('can output error if keyword too long', () => {
    const { result, errorMsg } = searchKeyword(searchData, '1234567890123456789012345678901234567890');
    expect(result).toEqual([]);
    expect(errorMsg).toEqual(ERR_KEYWORD_TOO_LONG);
  });
});
