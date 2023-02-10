import doDebounceSearch from "./doDebounceSearch";
import doSearchFilterSort from "./doSearchFilterSort";

jest.mock("./doSearchFilterSort");

describe("doDebounceSearch", () => {
  let parametersForDoSearchFilterSort;
  let memoizedDebouncedSearch;
  let executedSearchesCount;
  let setExecutedSearchesCount;
  let result;

  beforeEach(() => {
    parametersForDoSearchFilterSort = [1, 2, 3];
    memoizedDebouncedSearch = jest.fn();
    executedSearchesCount = 0;
    setExecutedSearchesCount = jest.fn();

    result = doDebounceSearch(
      parametersForDoSearchFilterSort,
      memoizedDebouncedSearch,
      executedSearchesCount,
      setExecutedSearchesCount
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call doSearchFilterSort initially without debouncing", () => {
    executedSearchesCount = 1;
    doDebounceSearch(
      parametersForDoSearchFilterSort,
      memoizedDebouncedSearch,
      executedSearchesCount,
      setExecutedSearchesCount
    );
    expect(doSearchFilterSort).toHaveBeenCalledWith(...parametersForDoSearchFilterSort);
    expect(memoizedDebouncedSearch).not.toHaveBeenCalled();
  });

  it("should debounce calls after the initial 2 calls", () => {
    executedSearchesCount = 2;
    doDebounceSearch(
      parametersForDoSearchFilterSort,
      memoizedDebouncedSearch,
      executedSearchesCount,
      setExecutedSearchesCount
    );
    expect(doSearchFilterSort).not.toHaveBeenCalled();
    expect(memoizedDebouncedSearch).toHaveBeenCalledWith(...parametersForDoSearchFilterSort);
  });

  it("should increment the executedSearchesCount by 1 after each call", () => {
    executedSearchesCount = 1;
    doDebounceSearch(
      parametersForDoSearchFilterSort,
      memoizedDebouncedSearch,
      executedSearchesCount,
      setExecutedSearchesCount
    );
    expect(setExecutedSearchesCount).toHaveBeenCalledWith(2);

    executedSearchesCount = 2;
    doDebounceSearch(
      parametersForDoSearchFilterSort,
      memoizedDebouncedSearch,
      executedSearchesCount,
      setExecutedSearchesCount
    );
    expect(setExecutedSearchesCount).toHaveBeenCalledWith(3);
  });
});
