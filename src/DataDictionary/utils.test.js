import {
  getType,
  truncateLines,
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
  });

  it('knows how to break sentences', () => {
    expect();
  });
});