import './typedef';

/**
 * @return {ExplorerCohort}
 */
export function createEmptyCohort() {
  return {
    name: '',
    description: '',
    filters: {},
  };
}

/**
 * @param {string} string
 * @param {number} maxLength
 */
export function truncateWithEllipsis(string, maxLength) {
  return string.length > maxLength
    ? string.slice(0, maxLength - 3) + '...'
    : string;
}
