/** @typedef {import('./types').IndexState} IndexState */
/** @type {import('redux').Reducer<IndexState>} */
const index = (state = /** @type {IndexState} */ ({}), action) => {
  switch (action.type) {
    case 'RECEIVE_INDEX_PAGE_COUNTS': {
      return {
        ...state,
        ...action.payload,
        updatedAt: Date.now(),
      };
    }
    default:
      return state;
  }
};

export default index;
