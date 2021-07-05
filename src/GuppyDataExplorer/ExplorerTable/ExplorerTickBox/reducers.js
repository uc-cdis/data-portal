function getInitialState() {
  return {
    selectingMode: true, // intially, items are being selected
                         // false indicates items are being deselected
    filteredItems: {},   // items to include or exclude from manifest, based on selectingMode
    allSelected: false,
  };
}

function getSelectAllState() {
  return {
    selectingMode: false,
    filteredItems: {},
    allSelected: true,
  };
}

const tickbox = (state = {selectingMode: true, filteredItems: {}, allSelected: false}, action) => {
  switch (action.type) {
    case 'DESELECT_TICKBOX':
      if (state.selectingMode && state.filteredItems == {} && !allSelected) {
        return state;
      }
      return getInitialState();

    case 'TOGGLE_SELECT_ALL':
      // if allSelected is true, transition back to 
      // initial state (nothing selected)
      if (state.allSelected){
        const newState = getInitialState();
        return newState;
      } else {
        // moving to every item toggled
        // does not matter what items were previously selected
        const newState = getSelectAllState();
        return newState;
      }

    case 'TOGGLE_TICKBOX':
      var newToggleValue = true;
      if (action.key in state.filteredItems) {
        newToggleValue = !state.filteredItems[action.key];
      }
      // check for cases equivalent to toggling SELECT ALL
      var isEmpty = true; for (var key in state.filteredItems) { isEmpty = false; break; }
      if (!isEmpty) {
        var itemCount = 1;
        var allBoxesTickedTheSame = true;
        for (const item in state.filteredItems){
          if (item == action.key) { continue; }
          if (state.filteredItems[item] != newToggleValue){
            allBoxesTickedTheSame = false;
            break;
          }
          itemCount = itemCount + 1;
        }
        if (allBoxesTickedTheSame){
          if (state.selectingMode) { 
            if (itemCount == action.totalCount && newToggleValue) {
              // all are ticked -> move to select all state
              return getSelectAllState();
            } else if (!newToggleValue) {
              return getInitialState();
            }
          } 
          else if (!state.selectingMode){
            // if all boxes are ticked, don't need to check total count
            if (!newToggleValue){
              return getSelectAllState();
            }
            // if all boxes are unticked, need to check total count
            else if (itemCount == action.totalCount){
              return getInitialState();
            }
          }
        }
      }

      // otherwise, toggle a single tickbox
      return {
        ...state,
        selectingMode: state.selectingMode,
        filteredItems: {
          ...state.filteredItems,
          [action.key]: newToggleValue,
        },
        allSelected: false
      };

    default:
      return state;
  }
};

export default tickbox;
