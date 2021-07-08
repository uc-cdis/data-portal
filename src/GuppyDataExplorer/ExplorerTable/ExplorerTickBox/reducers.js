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
  var newToggleValue = true;
  var isEmpty = true;
  switch (action.type) {
    case 'DESELECT_TICKBOX':
      if (state.selectingMode && state.filteredItems === {} && !state.allSelected) {
        return state;
      }
      return getInitialState();

    case 'TOGGLE_SELECT_ALL':
      // if allSelected is true, transition back to 
      // initial state (nothing selected)
      if (state.allSelected){
        return getInitialState();
      } else {
        // moving to every item toggled
        // does not matter what items were previously selected
        return getSelectAllState();
      }

    case 'TOGGLE_TICKBOX':
      if (action.key in state.filteredItems) {
        newToggleValue = !state.filteredItems[action.key];
      }
      // check for cases equivalent to toggling SELECT ALL
      Object.keys(state.filteredItems).forEach(function(_) {
        isEmpty = false;
      })
      if (!isEmpty) {
        let itemCount = 1;
        let allBoxesTickedTheSame = true;
        Object.keys(state.filteredItems).forEach(function(item) {
          if (item !== action.key && state.filteredItems[item] !== newToggleValue){
            allBoxesTickedTheSame = false;
          } else {
            itemCount = itemCount + 1;
          }
        })
        if (allBoxesTickedTheSame){
          if (state.selectingMode) { 
            if (itemCount === action.totalCount && newToggleValue) {
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
            else if (itemCount === action.totalCount){
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
