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
  }

  return state;
}

const preloadedState = getpreloadedState();
// @ts-ignore
const composeWithDevTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
const composeEnhancers =
  process.env.NODE_ENV !== 'production' && composeWithDevTools !== undefined
    ? composeWithDevTools
    : compose;
const enhancer = composeEnhancers(applyMiddleware(thunk));

/** @typedef {import('redux').Store} ReduxStore */

/** @type {ReduxStore} */
let store;
/** @type {Promise<ReduxStore>} */
let storePromise;

/* eslint-disable no-underscore-dangle */
/**
 * Little lazy redux store singleton factory.
 * We want some Relayjs adapters to also update the Redux store,
 * so it's handy to be able to access the store outside of
 * the normal react-redux 'connect' mechanism.
 *
 * @return Promisified Redux store
 */
const getReduxStore = () => {
  // singleton
  if (store) return Promise.resolve(store);

  // store setup is in process
  if (storePromise) return storePromise;

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
