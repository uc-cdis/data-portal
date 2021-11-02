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
        case 'REDIRECTED_FOR_ACTION':
            return {
                ...state,
                actionToResume: action.actionToResume,
                selectedResources: action.selectedResources
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
