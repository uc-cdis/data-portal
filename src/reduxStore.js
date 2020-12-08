import { persistStore, autoRehydrate } from 'redux-persist';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import dict from './dictionary';
import { mockStore, dev, requiredCerts } from './localconf';
import reducers from './reducers';

let store;
let storePromise;

/* eslint-disable no-underscore-dangle */
/**
 * Little lazy redux store singleton factory.
 * We want some Relayjs adapters to also update the Redux store,
 * so it's handy to be able to access the store outside of
 * the normal react-redux 'connect' mechanism.
 *
 * @return Promise<Store>
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

      const composeEnhancers =
        typeof window !== 'undefined'
          ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
          : compose;

      store = createStore(
        reducers,
        preloadedState,
        composeEnhancers(applyMiddleware(thunk), autoRehydrate())
      );
      persistStore(store, { whitelist: ['certificate'] }, () => resolve(store));
    } catch (e) {
      reject(e);
    }
  });
  return storePromise;
};

export default getReduxStore;
