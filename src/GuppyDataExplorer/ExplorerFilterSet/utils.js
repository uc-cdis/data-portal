import { capitalizeFirstLetter } from '../../utils';

/** @typedef {import('../types').ExplorerFilter} ExplorerFilter */
/** @typedef {import('../types').ExplorerFilterSet} ExplorerFilterSet */

/**
 * @return {ExplorerFilterSet}
 */
export function createEmptyFilterSet() {
  return {
    name: '',
    description: '',
    filter: {},
  };
}

/**
 * @param {string} string
 * @param {number} maxLength
 */
export function truncateWithEllipsis(string, maxLength) {
  return string.length > maxLength
    ? `${string.slice(0, maxLength - 3)}...`
    : string;
}

/**
 * @param {ExplorerFilter} filters
 * @param {number} level Nesting level
 */
export function stringifyFilters(filters, level = 0) {
  if (Object.keys(filters).length === 0) return '';

  let filterStr = '';
  for (const [key, value] of Object.entries(filters)) {
    if ('filter' in value) {
      const [anchorFieldName, anchorValue] = key.split(':');
      filterStr += `${'\t'.repeat(level)}* ${capitalizeFirstLetter(
        anchorFieldName
      )}: '${capitalizeFirstLetter(anchorValue)}'\n`;
      filterStr += stringifyFilters(value.filter, level + 1);
    } else {
      filterStr += `${'\t'.repeat(level)}* ${capitalizeFirstLetter(key)}\n`;
      if ('selectedValues' in value)
        for (const selected of value.selectedValues)
          filterStr += `${'\t'.repeat(level + 1)}- '${selected}'\n`;
      else if ('lowerBound' in value)
        filterStr += `${'\t'.repeat(level + 1)}- from: ${
          value.lowerBound
        }\n${'\t'.repeat(level + 1)}- to: ${value.upperBound}\n`;
    }
  }

  return filterStr;
}
