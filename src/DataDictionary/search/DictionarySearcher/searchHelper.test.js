import { prepareSearch, getSearchSummary } from './searchHelper';

describe('dictionary search helper', () => {
  it('can search', () => {
    const dictionary = {
      a1: {
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
        id: 'a2',
        category: 'A',
        description: 'whatever',
        properties: [],
      },
      b1: {
        id: 'b1',
        category: 'B',
        description: 'whatever',
        properties: [],
      },
      b2: {
        id: 'b2',
        category: 'B',
        description: 'whatever',
        properties: [],
      },
      b3: {
        id: 'b3',
        category: 'B',
        description: 'whatever',
        properties: [],
      },
      b4: {
        id: 'b4',
        category: 'B',
        description: 'whatever',
        properties: [],
      },
    };
    const searchHandnler = prepareSearch(dictionary);
    const result = searchHandnler.search('test');
    expect(result).toBeDefined();
    const summary = getSearchSummary(result);
    expect(summary.matchedPropertiesCount).toBeDefined();
    expect(summary.matchedNodesCount).toBeDefined();
  });
});
