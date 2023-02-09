import { DebounceSearch } from './DebounceSearch';
import { debounce } from 'lodash';

jest.mock('lodash', () => {
  return {
    debounce: jest.fn(func => func),
  };
});

describe('DebounceSearch', () => {
  let doSearchFilterSort, setExecutedSearches;
  beforeEach(() => {
    doSearchFilterSort = jest.fn();
    setExecutedSearches = jest.fn();
  });

  it('executes the doSearchFilterSort function immediately the first two times it is called', () => {
    let executedSearches = 0;
    DebounceSearch(doSearchFilterSort, executedSearches, setExecutedSearches);
    expect(doSearchFilterSort).toHaveBeenCalledTimes(1);
    expect(setExecutedSearches).toHaveBeenCalledTimes(1);
    executedSearches = 1;
    DebounceSearch(doSearchFilterSort, executedSearches, setExecutedSearches);
    expect(doSearchFilterSort).toHaveBeenCalledTimes(2);
    expect(setExecutedSearches).toHaveBeenCalledWith(2);
  });

  it('debounces the doSearchFilterSort function after the first two calls', () => {
    let executedSearches = 2;
    DebounceSearch(doSearchFilterSort, executedSearches, setExecutedSearches);
    expect(debounce).toHaveBeenCalledWith(doSearchFilterSort, 500);
  });
});
