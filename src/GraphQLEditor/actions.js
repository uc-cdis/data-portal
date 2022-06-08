/**
 * @param {import('./types').GraphiqlState['guppySchema']} payload
 * @returns {import('redux').AnyAction}
 */
export function receiveGuppySchema(payload) {
  return { type: 'RECEIVE_GUPPY_SCHEMA', payload };
}

/**
 * @param {import('./types').GraphiqlState['schema']} payload
 * @returns {import('redux').AnyAction}
 */
export function receiveSchema(payload) {
  return { type: 'RECEIVE_SCHEMA', payload };
}
