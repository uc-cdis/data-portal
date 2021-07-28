import { stringifyFilters } from './utils';

describe('stringifyFilters', () => {
  it('displays a simple option filter', () => {
    const filterState = {
      a: {
        selectedValues: ['foo', 'bar'],
      },
    };
    const expected = "* A\n\t- 'foo'\n\t- 'bar'\n";
    expect(stringifyFilters(filterState)).toEqual(expected);
  });
  it('displays a simple range filter', () => {
    const filterState = {
      b: {
        lowerBound: 0,
        upperBound: 1,
      },
    };
    const expected = '* B\n\t- from: 0\n\t- to: 1\n';
    expect(stringifyFilters(filterState)).toEqual(expected);
  });
  it('displays multiple simple filters', () => {
    const filterState = {
      a: {
        selectedValues: ['foo', 'bar'],
      },
      b: {
        lowerBound: 0,
        upperBound: 1,
      },
    };
    const expected = "* A\n\t- 'foo'\n\t- 'bar'\n* B\n\t- from: 0\n\t- to: 1\n";
    expect(stringifyFilters(filterState)).toEqual(expected);
  });
  it('displays multiple filters with an anchor', () => {
    const filterState = {
      'x:y': {
        filter: {
          a: {
            selectedValues: ['foo', 'bar'],
          },
          b: {
            lowerBound: 0,
            upperBound: 1,
          },
        },
      },
    };
    const expected =
      "* X: 'Y'\n\t* A\n\t\t- 'foo'\n\t\t- 'bar'\n\t* B\n\t\t- from: 0\n\t\t- to: 1\n";
    expect(stringifyFilters(filterState)).toEqual(expected);
  });
  it('displays multiple filters', () => {
    const filterState = {
      a: {
        selectedValues: ['foo', 'bar'],
      },
      'x:y': {
        filter: {
          a: {
            selectedValues: ['foo', 'bar'],
          },
          b: {
            lowerBound: 0,
            upperBound: 1,
          },
        },
      },
    };
    const expected =
      "* A\n\t- 'foo'\n\t- 'bar'\n* X: 'Y'\n\t* A\n\t\t- 'foo'\n\t\t- 'bar'\n\t* B\n\t\t- from: 0\n\t\t- to: 1\n";
    expect(stringifyFilters(filterState)).toEqual(expected);
  });
});
