import { DiscoveryConfig } from '../../DiscoveryConfig';

interface FilterState {
    [key: string]: { [value: string]: boolean }
  }

const filterByAdvSearch = (studies: any[], advSearchFilterState: FilterState, config: DiscoveryConfig, filterMultiSelectionLogic: string): any[] => {
  // if no filters active, show all studies
  const noFiltersActive = Object.values(advSearchFilterState).every((selectedValues) => {
    if (Object.values(selectedValues).length === 0) {
      return true;
    }
    if (Object.values(selectedValues).every((selected) => !selected)) {
      return true;
    }
    return false;
  });
  if (noFiltersActive) {
    return studies;
  }

  // Combine within filters as AND
  if (filterMultiSelectionLogic === 'AND') {
    return studies.filter((study) => Object.keys(advSearchFilterState).every((filterName) => {
      const filterValues = Object.keys(advSearchFilterState[filterName]);
      // Handle the edge case where no values in this filter are selected
      if (filterValues.length === 0) {
        return true;
      }
      if (!config.features.advSearchFilters) {
        return false;
      }
      const studyFilters = study[config.features.advSearchFilters.field];
      if (!studyFilters || !studyFilters.length) {
        return false;
      }

      const studyFilterValues = studyFilters.filter(({ key }) => key === filterName)
        .map(({ value }) => value);
      return filterValues.every((value) => studyFilterValues.includes(value));
    }));
  }

  // Combine within filters as OR
  return studies.filter((study) => Object.keys(advSearchFilterState).some((filterName) => {
    const filterValues = Object.keys(advSearchFilterState[filterName]);
    // Handle the edge case where no values in this filter are selected
    if (filterValues.length === 0) {
      return true;
    }
    if (!config.features.advSearchFilters) {
      return false;
    }
    const studyFilters = study[config.features.advSearchFilters.field];
    if (!studyFilters || !studyFilters.length) {
      return false;
    }

    return studyFilters.some(({ key, value }) => key === filterName && filterValues.includes(value));
  }));
};

export default filterByAdvSearch;
