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
  Object.keys(state.filteredItems).forEach(function(key) {
    if (state.filteredItems[key]){
      isEmpty = false; 
    }
  })
  if (isEmpty) {
    return false;
  }
  return true;
}

export function manifestTickBoxFilter(resultManifestInput) {
  function checkItem(item) {
    const refFieldInResourceIndex =
      this.props.guppyConfig.manifestMapping.referenceIdFieldInResourceIndex;
    if (item[refFieldInResourceIndex] in this.props.filteredItems) {
      return this.props.filteredItems[item[refFieldInResourceIndex]];
    }
    return false;
  }
  let cI = checkItem.bind(this);
  function cNI(item){
    return !cI(item);
  }
  let resultManifest = resultManifestInput;

  if (manifestShouldFilterIndividualItems(this.props)) {
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

