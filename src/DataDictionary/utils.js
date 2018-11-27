import { dataDictionaryTemplatePath } from '../localconf';

export const truncateLines = (str, maxCharInRow = 10) => {
  const wordsList = str.split(' ');
  const res = [];
  let cur = wordsList[0];
  for (let i = 1; i < wordsList.length; i += 1) {
    if (cur.length + wordsList[i].length > maxCharInRow) {
      res.push(cur);
      cur = wordsList[i];
    } else {
      cur = `${cur} ${wordsList[i]}`;
    }
  }
  res.push(cur);
  return res;
};

/**
 * Little helper to extract the type for some dictionary node property.
 * Export just for testing.
 * @param {Object} property one of the properties of a dictionary node
 * @return {String|Array<String>} string for scalar types, array for enums
 *                   and other listish types or 'UNDEFINED' if no
 *                   type information availabale
 */
export const getType = (property) => {
  let type = 'UNDEFINED';
  if ('type' in property) {
    if (typeof property.type === 'string') {
      type = property.type;
    } else {
      type = property.type;
    }
  } else if ('enum' in property) {
    type = property.enum;
  } else if ('oneOf' in property) {
    // oneOf has nested type list - we want to flatten nested enums out here ...
    type = property.oneOf
      .map(item => getType(item))
      .reduce(
        (flatList, it) => {
          if (Array.isArray(it)) {
            return flatList.concat(it);
          }
          flatList.push(it);
          return flatList;
        }, [],
      );
  } else {
    type = 'UNDEFINED';
  }

  return type;
};


export const downloadTemplate = (format, nodeId) => {
  if (format === 'tsv' || format === 'json') {
    const templatePath = `${dataDictionaryTemplatePath}${nodeId}?format=${format}`;
    window.open(templatePath);
  }
};
