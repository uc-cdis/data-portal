import doDebounceSearch from "./doDebounceSearch";
import doSearchFilterSort from "./doSearchFilterSort";

jest.mock("./doSearchFilterSort");

describe("doDebounceSearch", () => {
  let memoizedDebouncedSearch;
  let setExecutedSearchesCount;
  beforeEach(() => {
    memoizedDebouncedSearch = jest.fn(() => {});
    setExecutedSearchesCount = jest.fn(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should execute doSearchFilterSort initially without debouncing", () => {
    doDebounceSearch([1, 2, 3], memoizedDebouncedSearch, 0, setExecutedSearchesCount);
    expect(doSearchFilterSort).toHaveBeenCalledWith(1, 2, 3);
    expect(memoizedDebouncedSearch).not.toHaveBeenCalled();
    expect(setExecutedSearchesCount).toHaveBeenCalledWith(1);

    jest.clearAllMocks();
    doDebounceSearch([4, 5, 6], memoizedDebouncedSearch, 1, setExecutedSearchesCount);
    expect(doSearchFilterSort).toHaveBeenCalledWith(4, 5, 6);
    expect(memoizedDebouncedSearch).not.toHaveBeenCalled();
    expect(setExecutedSearchesCount).toHaveBeenCalledWith(2);
  });

  it("should debounce the doSearchFilterSort call when executedSearchesCount >= 2", () => {
    doDebounceSearch([1, 2, 3], memoizedDebouncedSearch, 2, setExecutedSearchesCount);
    expect(doSearchFilterSort).not.toHaveBeenCalled();
    expect(memoizedDebouncedSearch).toHaveBeenCalledWith(1, 2, 3);
    expect(setExecutedSearchesCount).not.toHaveBeenCalled();
  });
});
