/** @type {import('redux').Reducer} */
const index = (state = {}, action) => {
  switch (action.type) {
    case 'RECEIVE_INDEX_PAGE_COUNTS': {
      return {
        ...state,
        ...action.data,
        updatedAt: Date.now(),
      };
    }
    default:
      return state;
  }
};

export default index;
