/**
 * @return {import('../types').ExplorerFilterSet}
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
