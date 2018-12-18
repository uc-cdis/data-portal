import React from 'react';
import { getPropertyDescription, getType } from '../../utils';

export const escapeReturnChar = (str) => {
  if (!str) return str;
  const pieces = str.split('\\n');
  if (pieces.length <= 1) return str;
  return pieces.map((piece, i) => (
    <span
      key={`span-${i}`}
      className={(i === 0 || i === pieces.length) ? '' : 'search-result-table__span--new-line'}
    >
      {piece}
    </span>
  ));
};

export const addHighlightingSpans = (str, indices) => {
  let cursor = 0;
  let currentIndices = 0;
  const resultFragments = [];
  while (currentIndices < indices.length) {
    if (cursor < indices[currentIndices][0]) {
      resultFragments.push(
        (
          <div
            key={cursor}
            className='search-result-table__span'
          >
            {escapeReturnChar(str.substring(cursor, indices[currentIndices][0]))}
          </div>
        ),
      );
    }
    resultFragments.push(
      (
        <div
          key={indices[currentIndices][0]}
          className='search-result-table__span search-result-table__span--highlight'
        >
          {
            escapeReturnChar(
              str.substring(
                indices[currentIndices][0],
                indices[currentIndices][1] + 1),
            )
          }
        </div>
      ),
    );
    cursor = indices[currentIndices][1] + 1;
    currentIndices += 1;
  }
  if (cursor < str.length) {
    resultFragments.push(
      (
        <div
          key={cursor}
          className='search-result-table__span'
        >
          {escapeReturnChar(str.substring(cursor))}
        </div>
      ),
    );
  }
  return resultFragments;
};

export const getPropertyNameFragment = (propertyName, matchedItem) => {
  const propertyNameFragment = addHighlightingSpans(
    propertyName,
    matchedItem ? matchedItem.indices : [],
  );
  return propertyNameFragment;
};

export const getPropertyTypeFragment = (property, typeMatchList) => {
  const type = getType(property);
  let propertyTypeFragment;
  if (typeof type === 'string') {
    propertyTypeFragment = (
      <li>
        {addHighlightingSpans(type, typeMatchList[0] ? typeMatchList[0].indices : [])}
      </li>
    );
  } else {
    propertyTypeFragment = type.map((t, i) => {
      const matchedTypeItem = typeMatchList.find(matchItem => matchItem.value === t);
      if (matchedTypeItem) {
        return (
          <li key={i}>
            {addHighlightingSpans(t, matchedTypeItem.indices)}
          </li>
        );
      }
      return (
        <li key={i}>
          {addHighlightingSpans(t, [])}
        </li>
      );
    });
  }
  return propertyTypeFragment;
};

export const getPropertyDescriptionFragment = (property, matchedItem) => {
  let descriptionStr = getPropertyDescription(property);
  if (!descriptionStr) descriptionStr = 'No Description';
  const propertyDescriptionFragment = addHighlightingSpans(
    descriptionStr,
    matchedItem ? matchedItem.indices : [],
  );
  return propertyDescriptionFragment;
};

export const getNodeDescriptionFragment = (allMatches, description) => {
  const matchedItem = allMatches.find(item => item.key === 'description');
  const nodeDescriptionFragment = addHighlightingSpans(
    description,
    matchedItem ? matchedItem.indices : [],
  );
  return nodeDescriptionFragment;
};

export const getMatchInsideProperty = (propertyIndex, property, allMatches) => {
  let nameMatch = null;
  let descriptionMatch = null;
  const typeMatchList = [];
  allMatches.forEach((item) => {
    if (item.key === 'properties.name' && item.arrayIndex === propertyIndex) {
      nameMatch = item;
    } else if (item.key === 'properties.description' && item.arrayIndex === propertyIndex) {
      descriptionMatch = item;
    } else if (item.key === 'properties.type') {
      const type = getType(property);
      if (typeof type === 'string') {
        if (type === item.value) {
          typeMatchList.push(item);
        }
      } else if (type.includes(item.value)) {
        typeMatchList.push(item);
      }
    }
  });
  return {
    nameMatch,
    descriptionMatch,
    typeMatchList,
  };
};

export const getMatchesSummaryForProperties = (allProperties, allMatches) => {
  const matchedPropertiesSummary = [];
  Object.keys(allProperties).forEach((propertyKey, propertyIndex) => {
    const property = allProperties[propertyKey];
    const {
      nameMatch,
      descriptionMatch,
      typeMatchList,
    } = getMatchInsideProperty(propertyIndex, property, allMatches);
    const summaryItem = {
      propertyKey,
      property,
      nameMatch,
      descriptionMatch,
      typeMatchList,
    };
    if (nameMatch || descriptionMatch || typeMatchList.length > 0) {
      matchedPropertiesSummary.push(summaryItem);
    }
  });
  return matchedPropertiesSummary;
};
