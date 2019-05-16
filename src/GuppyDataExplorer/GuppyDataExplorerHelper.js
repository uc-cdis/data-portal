/* eslint-disable max-len */
import _ from 'lodash';

export function checkForAnySelectedUnaccessibleField(aggsData, accessibleFieldObject, fieldToCheck) { // if true, means user has unaccessible fields in aggsData
  let accessValuesInAggregationList = [];
  if (!accessibleFieldObject || !accessibleFieldObject[fieldToCheck]) {
    return false;
  }

  const accessibleValues = accessibleFieldObject[fieldToCheck];
  if (aggsData
      && aggsData[fieldToCheck]
      && aggsData[fieldToCheck].histogram) {
    accessValuesInAggregationList = aggsData[fieldToCheck].histogram.map(entry => entry.key);
    const outOfScopeValues = _.difference(accessValuesInAggregationList, accessibleValues);
    if (outOfScopeValues.length > 0) { // trying to get unaccessible data is forbidden
      return true;
    }
    return false;
  }
  return false;
}

export function checkForNoAccessibleProject(accessibleFieldObject, fieldToCheck) { // if true, means user don't have access to any project
  if (!accessibleFieldObject || !accessibleFieldObject[fieldToCheck]) {
    return false;
  }
  return (accessibleFieldObject[fieldToCheck].length === 0);
}

export function checkForFullAccessibleProject(unaccessibleFieldObject, fieldToCheck) { // if true, means user have full access to all projects
  if (!unaccessibleFieldObject || !unaccessibleFieldObject[fieldToCheck]) {
    return false;
  }
  return (unaccessibleFieldObject[fieldToCheck].length === 0);
}
