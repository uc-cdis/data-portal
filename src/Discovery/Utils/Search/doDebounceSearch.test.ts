import doDebounceSearch from './doDebounceSearch';
import doSearchFilterSort from './doSearchFilterSort';

jest.mock('./doSearchFilterSort');

describe('doDebounceSearch', () => {
  let memoizedDebouncedSearch;
  let setExecutedSearchesCount;
  beforeEach(() => {
    memoizedDebouncedSearch = jest.fn(() => {});
    setExecutedSearchesCount = jest.fn(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should execute doSearchFilterSort initially without debouncing', () => {
    doDebounceSearch({test:"test"}, memoizedDebouncedSearch, 0, setExecutedSearchesCount);
    expect(doSearchFilterSort).toHaveBeenCalledWith({test:"test"});
    expect(memoizedDebouncedSearch).not.toHaveBeenCalled();
    expect(setExecutedSearchesCount).toHaveBeenCalledWith(1);

    jest.clearAllMocks();
    doDebounceSearch({test:"test2"}, memoizedDebouncedSearch, 1, setExecutedSearchesCount);
    expect(doSearchFilterSort).toHaveBeenCalledWith({test:"test2"});
    expect(memoizedDebouncedSearch).not.toHaveBeenCalled();
    expect(setExecutedSearchesCount).toHaveBeenCalledWith(2);
  });

  it('should debounce the doSearchFilterSort call when executedSearchesCount >= 2', () => {
    doDebounceSearch({test:"test3"}, memoizedDebouncedSearch, 2, setExecutedSearchesCount);
    expect(doSearchFilterSort).not.toHaveBeenCalled();
    expect(memoizedDebouncedSearch).toHaveBeenCalledWith({test:"test3"});
    expect(setExecutedSearchesCount).not.toHaveBeenCalled();
  });
});
