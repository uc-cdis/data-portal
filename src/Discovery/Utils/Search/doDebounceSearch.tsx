import doSearchFilterSort from './doSearchFilterSort';

const doDebounceSearch = (
  parametersForDoSearchFilterSort: {},
  memoizedDebouncedSearch: (...args: any[]) => void,
  executedSearchesCount: number,
  setExecutedSearchesCount: (count: number) => void,
) => {
  const initialSearchesWithoutDebounce = 2;
  // Execute searches initially without debounce to decrease page load time
  if (executedSearchesCount < initialSearchesWithoutDebounce) {
    setExecutedSearchesCount(executedSearchesCount + 1);
    return doSearchFilterSort(parametersForDoSearchFilterSort);
  }
  // Otherwise debounce the calls
  return memoizedDebouncedSearch(parametersForDoSearchFilterSort);
};
export default doDebounceSearch;
