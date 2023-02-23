import filterByTags from './filterByTags';
import filterByAdvSearch from './filterByAdvSearch';
import { Props, FilterState, AccessSortDirection } from '../../Discovery';
import { DiscoveryConfig } from '../../DiscoveryConfig';

interface ParametersForDoSearchFilterSort {
  props: Props,
  jsSearch: any,
  config: DiscoveryConfig,
  setVisibleResources: (...args: any[]) => void,
  filterState: FilterState,
  filterMultiSelectionLogic: string,
  accessibleFieldName: string,
  AccessSortDirection: AccessSortDirection,
}

const doSearchFilterSort = (parametersForDoSearchFilterSort: ParametersForDoSearchFilterSort) => {
  const {
    props,
    jsSearch,
    config,
    setVisibleResources,
    filterState,
    filterMultiSelectionLogic,
    accessibleFieldName,
    AccessSortDirection,
  } = parametersForDoSearchFilterSort;
  let filteredResources = props.studies;
  if (jsSearch && props.searchTerm) {
    filteredResources = jsSearch.search(props.searchTerm);
  }
  filteredResources = filterByTags(
    filteredResources,
    props.selectedTags,
    config,
  );

  if (
    config.features.advSearchFilters
    && config.features.advSearchFilters.enabled
  ) {
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

  filteredResources = filteredResources.sort((a, b) => {
    if (props.accessSortDirection === AccessSortDirection.DESCENDING) {
      return a[accessibleFieldName] - b[accessibleFieldName];
    }
    if (props.accessSortDirection === AccessSortDirection.ASCENDING) {
      return b[accessibleFieldName] - a[accessibleFieldName];
    }
    return 0;
  });
  setVisibleResources(filteredResources);
};
export default doSearchFilterSort;
