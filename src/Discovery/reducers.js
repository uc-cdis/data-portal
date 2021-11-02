import { Pagination } from "antd"
import { AccessLevel } from "./Discovery";

const discovery = (
    state = {
        selectedResources: [],
        actionToResume: null,
        accessFilters: {
            [AccessLevel.ACCESSIBLE]: true,
            [AccessLevel.NOT_AVAILABLE]: true,
            [AccessLevel.PENDING]: true,
            [AccessLevel.NOT_AVAILABLE]: true
        },
        selectedTags: {},
        pagination: {
            resultsPerPage: 10,
            currentPage: 1
        }
    },
    action
) => {
    switch (action.type) {
        case 'RESOURCES_SELECTED':
            return {
                ...state,
                selectedResources: action.selectedResources
            }
        case 'ACCESS_FILTER_SET':
            return {
                ...state,
                accessFilters: action.accessFilters
            }
        case 'TAGS_SELECTED':
            return {
                ...state,
                selectedTags: action.selectedTags
            }
        case 'SEARCH_TERM_SET':
            return {
                ...state,
                searchTerm: action.searchTerm
            }
        case 'PAGINATION_SET':
            return {
                ...state,
                pagination: action.pagination
            }
        case 'REDIRECTED_FOR_ACTION':
            return {
                ...state,
                ...action.redirectState
            }
        case 'REDIRECT_ACTION_RESUMED':
            return {
                ...state,
                actionToResume: null
            }
        default:
            return {...state}
    }
}

export default discovery;
