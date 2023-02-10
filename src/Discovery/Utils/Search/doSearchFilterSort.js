import filterByTags from "./filterByTags";
import filterByAdvSearch from "./filterByAdvSearch"

const doSearchFilterSort = (props, jsSearch, config, setVisibleResources, filterState, filterMultiSelectionLogic, accessibleFieldName, AccessSortDirection ) => {
    console.log('called doSearchFilterSort with ',props.studies, ' and search term', props.searchTerm);
    let filteredResources = props.studies;
    if (jsSearch && props.searchTerm) {
      filteredResources = jsSearch.search(props.searchTerm);
    }
    filteredResources = filterByTags(
      filteredResources,
      props.selectedTags,
      config,
    );

    if (config.features.advSearchFilters && config.features.advSearchFilters.enabled) {
      filteredResources = filterByAdvSearch(
        filteredResources,
        filterState,
        config,
        filterMultiSelectionLogic,
      );
    }

    if (props.config.features.authorization.enabled) {
      filteredResources = filteredResources.filter(
        (resource) => props.accessFilters[resource[accessibleFieldName]],
      );
    }

    filteredResources = filteredResources.sort(
      (a, b) => {
        if (props.accessSortDirection === AccessSortDirection.DESCENDING) {
          return a[accessibleFieldName] - b[accessibleFieldName];
        } if (props.accessSortDirection === AccessSortDirection.ASCENDING) {
          return b[accessibleFieldName] - a[accessibleFieldName];
        }
        return 0;
      },
    );
    setVisibleResources(filteredResources);
  };
  export default doSearchFilterSort;
