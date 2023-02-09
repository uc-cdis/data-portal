import { debounce } from 'lodash';
import { useCallback } from 'react';


const dbs = useCallback(debounce(doSearchFilterSort, debounceDelayInMilliseconds),[]);


const DebounceSearch = (doSearchFilterSort, executedSearches, setExecutedSearches) => {
  const debounceDelayInMilliseconds = 500;
  const initialSearchesWithoutDebounce = 2;

  // Execute searches initially without debounce to decrease page load time
  if (executedSearches < initialSearchesWithoutDebounce) {
    setExecutedSearches(executedSearches + 1);
    return doSearchFilterSort();
  }
  // Otherwise debounce the calls
  return debounce(doSearchFilterSort, debounceDelayInMilliseconds);
};

export default DebounceSearch;
