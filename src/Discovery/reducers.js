const discovery = (
    state = {
        selectedResources: [],
        actionToResume: null
    },
    action
) => {
    switch (action.type) {
        case 'RESOURCES_SELECTED':
            return {
                ...state,
                selectedResources: action.selectedResources
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
