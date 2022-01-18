/** @typedef {import('./types').PopupState} PopupState */

/** @type {import('redux').Reducer<PopupState>} */
const popups = (state = /** @type {PopupState} */ ({}), action) => {
  switch (action.type) {
    case 'UPDATE_POPUP':
      return { ...state, ...action.data };
    default:
      return state;
  }
};

export default popups;
