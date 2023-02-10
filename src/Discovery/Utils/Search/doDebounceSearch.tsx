import doSearchFilterSort from "./doSearchFilterSort";

const doDebounceSearch = (parametersForDoSearchFilterSort, memoizedDebouncedSearch, executedSearchesCount, setExecutedSearchesCount) => {
  const debounceDelayInMilliseconds = 500;
  const initialSearchesWithoutDebounce = 2;
    // Execute searches initially without debounce to decrease page load time
    if (executedSearchesCount < initialSearchesWithoutDebounce) {
      setExecutedSearchesCount(executedSearchesCount + 1);
      return doSearchFilterSort(...parametersForDoSearchFilterSort ) ;
    }
    // Otherwise debounce the calls
    // return debounce(doSearchFilterSort, debounceDelayInMilliseconds);
    return memoizedDebouncedSearch(...parametersForDoSearchFilterSort);
}
export default doDebounceSearch;
