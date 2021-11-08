import { AccessLevel, AccessSortDirection } from './Discovery';

const discovery = (
  state = {
    selectedResources: [],
    actionToResume: null,
    accessFilters: {
      [AccessLevel.ACCESSIBLE]: true,
      [AccessLevel.UNACCESSIBLE]: true,
      [AccessLevel.PENDING]: true,
      [AccessLevel.NOT_AVAILABLE]: true,
    },
    selectedTags: {},
    pagination: {
      resultsPerPage: 10,
      currentPage: 1,
    },
    accessSortDirection: AccessSortDirection.DESCENDING,
  },
  action,
) => {
  switch (action.type) {
  case 'RESOURCES_SELECTED':
    return {
      ...state,
      selectedResources: action.selectedResources,
    };
  case 'ACCESS_FILTER_SET':
    return {
      ...state,
      accessFilters: {
        ...state.accessFilters,
        ...action.accessFilters,
      },
      pagination: {
        ...state.pagination,
        currentPage: 1,
      },
    };
  case 'TAGS_SELECTED':
    return {
      ...state,
      selectedTags: action.selectedTags,
      pagination: {
        ...state.pagination,
        currentPage: 1,
      },
    };
  case 'SEARCH_TERM_SET':
    return {
      ...state,
      searchTerm: action.searchTerm,
      pagination: {
        ...state.pagination,
        currentPage: 1,
      },
    };
  case 'PAGINATION_SET':
    return {
      ...state,
      pagination: action.pagination,
    };
  case 'ACCESS_SORT_DIRECTION_SET':
    return {
      ...state,
      accessSortDirection: action.accessSortDirection,
    };
  case 'REDIRECTED_FOR_ACTION':
    return {
      ...state,
      ...action.redirectState,
    };
  case 'REDIRECT_ACTION_RESUMED':
    return {
      ...state,
      actionToResume: null,
    };
  default:
    return { ...state };
  }
};

export default discovery;
