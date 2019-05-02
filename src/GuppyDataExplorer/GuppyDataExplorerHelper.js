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
    accessValuesInAggregationList = aggsData.project.histogram.map(entry => entry.key);
    const outOfScopeValues = _.difference(accessValuesInAggregationList, accessibleValues);
    if (outOfScopeValues.length > 0) { // trying to get unaccessible data is forbidden
      return true;
    }
    return false;
  }
  return false;
}

export function checkForNoAccessibleProject(accessibleFieldObject) { // if true, means user don't have access to any project
  const accessField = 'project'; // only check for project
  if (!accessibleFieldObject || !accessibleFieldObject[accessField]) {
    return false;
  }
  return (accessibleFieldObject[accessField].length === 0);
}
