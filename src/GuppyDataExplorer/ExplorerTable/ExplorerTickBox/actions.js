export function addToggleAll() {
  return {
    type: 'TOGGLE_SELECT_ALL'
  }
}

export function addToggleOne(item, count) {
  return {
    type: 'TOGGLE_TICKBOX',
    key: item,
    totalCount: count
  }
}

export function deselectAll() {
  return {
    type: 'DESELECT_TICKBOX'
  }
}

function manifestShouldFilterIndividualItems(state) {
  var isEmpty = true; 
  for (var key in state.filteredItems) { 
    if (state.filteredItems[key]){
      isEmpty = false; 
      break; 
    }
  }
  if (isEmpty) {
    return false;
  }
  return true;
}

export function manifestTickBoxFilter(resultManifest) {
  if (manifestShouldFilterIndividualItems(this.props)) {
    function checkItem(item) {
      const refFieldInResourceIndex =
        this.props.guppyConfig.manifestMapping.referenceIdFieldInResourceIndex;
      if (item[refFieldInResourceIndex] in this.props.filteredItems) {
        return this.props.filteredItems[item[refFieldInResourceIndex]];
      }
      return false;
    }
    var cI = checkItem.bind(this);
    function cNI(item){
      return !cI(item);
    }
    if (this.props.selectingMode) {
      resultManifest = resultManifest.filter(cI);
    } else {
      resultManifest = resultManifest.filter(cNI);
    }
  }
  return resultManifest;
}

export function isSelected(key){
  // only 1 state where allSelected is true
  // every box must be ticked
  if (this.props.allSelected) {
    return true;
  }

  // SELECTING mode
  if (this.props.selectingMode) {
    if (key in this.props.filteredItems){
      // box could be ticked or unticked
      // if it's ticked, filteredItems[key] = true
      return this.props.filteredItems[key];
    }
    // box not ticked
    return false;
  }

  // DEselecting mode
  if (key in this.props.filteredItems){
    // box could be ticked or unticked
    // if it's unticked, filteredItems[key] = true
    return !(this.props.filteredItems[key]);
  }
  // item has not been unticked
  return true;
}

