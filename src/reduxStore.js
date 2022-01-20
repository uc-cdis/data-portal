import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { mockStore, requiredCerts } from './localconf';
import reducers from './reducers';

function getpreloadedState() {
  const state = {
    user: {},
    status: {},
    versionInfo: { dataVersion: '', portalVersion: process.env.PORTAL_VERSION },
  };

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

/** @type {import('redux').Store} */
let store;

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
  if (store) return Promise.resolve(store);

  store = createStore(reducers, preloadedState, enhancer);
  return Promise.resolve(store);
};

export default getReduxStore;
