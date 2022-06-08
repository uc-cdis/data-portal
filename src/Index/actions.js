/* eslint-disable import/prefer-default-export */

/**
 * @param {Omit<import('./types').IndexState, 'updatedAt'>} payload
 * @returns {import('redux').AnyAction}
 */
export function receiveIndexPageCounts(payload) {
  return { type: 'RECEIVE_INDEX_PAGE_COUNTS', payload };
}
