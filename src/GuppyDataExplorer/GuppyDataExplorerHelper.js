import _ from 'lodash';

function getComponentNoDisplayStatus(dataToCheck, accessibleFieldObject, accessField) {
  let accessValuesInAggregationList = [];
  if (!accessibleFieldObject || !accessibleFieldObject[accessField]) {
    return false;
  }

  const accessibleValues = accessibleFieldObject[accessField];
  if (dataToCheck
      && dataToCheck[accessField]) {
    if (dataToCheck[accessField].histogram) {
      accessValuesInAggregationList = dataToCheck.project.histogram.map(entry => entry.key);
      const outOfScopeValues = _.difference(accessValuesInAggregationList, accessibleValues);
      if (outOfScopeValues.length > 0) { // trying to get unaccessible data is forbidden
        return true;
      }
      return false;
    }
    // eslint-disable-next-line max-len
    accessValuesInAggregationList = dataToCheck[accessField]; // the input dataToCheck is the allFieldObject from GuppyWapper, to check for overall project access
    const outOfScopeValues = _.difference(accessValuesInAggregationList, accessibleValues);
    if (outOfScopeValues.length === accessValuesInAggregationList.length) {
      return true;
    }
    return false;
  }
  return false;
}

export default getComponentNoDisplayStatus;
