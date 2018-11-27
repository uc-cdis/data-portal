import { dataDictionaryTemplatePath } from '../localconf';

const concatTwoWords = (w1, w2) => {
  if (w1.length === 0) return w2;
  if (w2.length === 0) return w1;
  return `${w1} ${w2}`;
};

export const truncateLines = (str, maxCharInRow = 10, breakwordMinLength = 12) => {
  const wordsList = str.split(' ');
  const res = [];
  let currentLine = '';
  for (let i = 0; i < wordsList.length; i += 1) {
    // if adding a new word will make the current line too long
    if (concatTwoWords(currentLine, wordsList[i]).length > maxCharInRow) {
      // if the new word itself is too long, break it
      if (wordsList[i].length > breakwordMinLength) {
        let breakPos = maxCharInRow - currentLine.length - 1;
        if (currentLine.length > 0) breakPos -= 1; // 1 more for space
        res.push(`${concatTwoWords(currentLine, wordsList[i].substring(0, breakPos))}-`);

        // break the rest of the new word if it's still too long
        while (breakPos + maxCharInRow < wordsList[i].length) {
          const nextBreakPos = (breakPos + maxCharInRow) - 1;
          res.push(`${wordsList[i].substring(breakPos, nextBreakPos)}-`);
          breakPos = nextBreakPos;
        }
        currentLine = wordsList[i].substring(breakPos);
      } else { // else, end current line and create a new line
        if (currentLine.length > 0) { // avoid adding first empty line
          res.push(currentLine);
        }
        currentLine = wordsList[i];
      }
    } else { // else, just add the new word to current line
      currentLine = concatTwoWords(currentLine, wordsList[i]);
    }
  }
  res.push(currentLine);
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

export const graphStyleConfig = {
  nodeTextFontSize: 10,
  nodeTextLineGap: 4,
  nodeContentPadding: 20,
  nodeIconRadius: 10,
};

