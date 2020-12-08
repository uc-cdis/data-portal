import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';

import dict from './dictionary';
import { mockStore, dev, requiredCerts } from './localconf';
import reducers from './reducers';

const persistConfig = {
  key: 'primary',
  storage,
  whitelist: ['certificate'],
};
const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : compose;

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
      let preloadedState = {};

      if (!dev) preloadedState = { user: {}, status: {} };
      else if (mockStore)
        preloadedState = {
          user: { username: 'test', certificates_uploaded: requiredCerts },
          submission: {
            dictionary: dict,
            nodeTypes: Object.keys(dict).slice(2),
          },
          status: {},
        };

      store = createStore(
        persistReducer(persistConfig, reducers),
        preloadedState,
        composeEnhancers(applyMiddleware(thunk))
      );
      persistStore(store, null, () => resolve(store));
    } catch (e) {
      reject(e);
    }
  });
  return storePromise;
};

export default getReduxStore;
