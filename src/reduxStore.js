import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';

import { mockStore, requiredCerts } from './localconf';
import reducers from './reducers';

const persistConfig = {
  key: 'primary',
  storage,
  whitelist: ['certificate'],
};
const reducer = persistReducer(persistConfig, reducers);

function getpreloadedState() {
  const state = { user: {}, status: {} };

  if (process.env.NODE_ENV !== 'production' && mockStore) {
    state.user = { username: 'test', certificates_uploaded: requiredCerts };

    import('./dictionary').then((dictionary) => {
      state.submission = {
        dictionary,
        nodeTypes: Object.keys(dictionary).slice(2),
      };
    });
  }

  return state;
}

const preloadedState = getpreloadedState();
const composeEnhancers =
  process.env.NODE_ENV !== 'production' &&
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : compose;
const enhancer = composeEnhancers(applyMiddleware(thunk));

let store;
let storePromise;

/* eslint-disable no-underscore-dangle */
/**
 * Little lazy redux store singleton factory.
 * We want some Relayjs adapters to also update the Redux store,
 * so it's handy to be able to access the store outside of
 * the normal react-redux 'connect' mechanism.
 *
 * @return {Promise<any>} Promisified Redux store
 */
const getReduxStore = () => {
  if (store) {
    // singleton
    return Promise.resolve(store);
  }
  if (storePromise) {
    // store setup is in process
    return storePromise;
  }
  storePromise = new Promise((resolve, reject) => {
    try {
      store = createStore(reducer, preloadedState, enhancer);
      persistStore(store, null, () => resolve(store));
    } catch (e) {
      reject(e);
    }
  });
  return storePromise;
};

export default getReduxStore;
