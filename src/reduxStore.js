import { persistStore, autoRehydrate } from 'redux-persist';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import dict from './dictionary';
import { mockStore, dev } from './localconf';
import reducers from './reducers';
import { requiredCerts } from './configs';


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
  if (store) { // singleton
    return Promise.resolve(store);
  }
  if (storePromise) { // store setup is in process
    return storePromise;
  }
  storePromise = new Promise((resolve, reject) => {
    try {
      if (dev === true) {
        let data = {};
        if (mockStore) {
          data = { user: { username: 'test', certificates_uploaded: requiredCerts }, submission: { dictionary: dict, nodeTypes: Object.keys(dict).slice(2) }, status: {} };
        }
        store = compose(
          applyMiddleware(thunk), // routerMiddleware(browserHistory)),
          autoRehydrate(),
        )(createStore)(
          reducers,
          data,
          window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
        );
      } else {
        store = compose(
          applyMiddleware(thunk), // routerMiddleware(browserHistory)),
          autoRehydrate(),
        )(createStore)(
          reducers,
          { user: {}, status: {} },
          autoRehydrate(),
        );
      }

      persistStore(store,
        { whitelist: ['certificate'] },
        () => { resolve(store); },
      );
    } catch (e) {
      reject(e);
    }
  });
  return storePromise;
};

export default getReduxStore;
