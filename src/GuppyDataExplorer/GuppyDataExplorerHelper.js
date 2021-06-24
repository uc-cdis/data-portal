import _ from 'lodash';

// if true, means user has unaccessible fields in aggsData
export function checkForAnySelectedUnaccessibleField(
  aggsData,
  accessibleFieldObject,
  fieldToCheck) {
  let accessValuesInAggregationList = [];
  if (!accessibleFieldObject || !accessibleFieldObject[fieldToCheck]) {
    return false;
  }

  const accessibleValues = accessibleFieldObject[fieldToCheck];
  if (aggsData
      && aggsData[fieldToCheck]
      && aggsData[fieldToCheck].histogram) {
    accessValuesInAggregationList = aggsData[fieldToCheck].histogram.map((entry) => entry.key);
    const outOfScopeValues = _.difference(accessValuesInAggregationList, accessibleValues);
    if (outOfScopeValues.length > 0) { // trying to get unaccessible data is forbidden
      return true;
    }
    return false;
  }
  return false;
}

// if true, means user don't have access to any project
export function checkForNoAccessibleProject(
  accessibleFieldObject,
  fieldToCheck) {
  if (!accessibleFieldObject || !accessibleFieldObject[fieldToCheck]) {
    return false;
  }
  return (accessibleFieldObject[fieldToCheck].length === 0);
}

// if true, means user have full access to all projects
export function checkForFullAccessibleProject(
  unaccessibleFieldObject,
  fieldToCheck) {
  if (!unaccessibleFieldObject || !unaccessibleFieldObject[fieldToCheck]) {
    return false;
  }
  return (unaccessibleFieldObject[fieldToCheck].length === 0);
}
