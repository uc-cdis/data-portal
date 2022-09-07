/**
 * @param {Object} args
 * @param {string} args.columnName
 * @param {string} args.field
 * @param {Array} args.linkFields
 * @param {Array} args.rawData
 */
export function getColumnWidth({ columnName, field, linkFields, rawData }) {
  // special cases
  if ((rawData ?? []).length === 0) return 100;
  if (field === 'external_links') return 200;
  if (linkFields.includes(field)) return 80;

  // some magic numbers that work fine for table columns width
  const maxWidth = 400;
  const letterWidth = 8;
  const spacing = 20;

  const [fieldName] = field.split('.');
  let maxLetterLen = columnName.length;
  for (const d of rawData) {
    // the calculation logic here is a bit wild if it is a nested array field
    // it would convert the whole array to string and calculate
    // which in most cases would exceed the maxWidth so just use maxWidth
    const len = d?.[fieldName]?.toString().length ?? 0;
    maxLetterLen = Math.max(len, maxLetterLen);
  }

  return Math.min(maxLetterLen * letterWidth + spacing, maxWidth);
}

function isPlainObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** @param {Object[]} rawData */
export function parseDataForTable(rawData) {
  /** @type {Object[]} */
  const parsedData = [];
  for (const row of rawData) {
    const parsedRow = {};
    for (const [fieldName, value] of Object.entries(row)) {
      // if value is nested field value, must be parsed
      // nested field value is an array of object
      // where each object contains the pairs of nested field name & value
      // e.g. [{ foo: 0, bar: 'a' }, { foo: 1. bar: 'b' }]
      if (Array.isArray(value) && value.some(isPlainObject)) {
        // parsed nested field value is an object
        // which contains the pairs of nested field name & array of its values
        // e.g. { foo: [0, 1], bar: ['a', 'b'] }
        parsedRow[fieldName] = {};
        for (const obj of value)
          for (const [nestedFieldName, nestedValue] of Object.entries(obj)) {
            if (!(nestedFieldName in parsedRow[fieldName]))
              parsedRow[fieldName][nestedFieldName] = [];
            parsedRow[fieldName][nestedFieldName].push(nestedValue);
          }
      }
      // otherwise, use it as is
      else parsedRow[fieldName] = value;
    }
    parsedData.push(parsedRow);
  }
  return parsedData;
}
