import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { mockStore, requiredCerts } from './localconf';
import reducers from './reducers';

const preloadedState = {
  user:
    process.env.NODE_ENV !== 'production' && mockStore
      ? { username: 'test', certificates_uploaded: requiredCerts }
      : {},
  status: {},
  versionInfo: {
    dataVersion: '',
    dictionaryVersion: '',
    portalVersion: process.env.PORTAL_VERSION,
  },
};
// @ts-expect-error
const composeWithDevTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
const composeEnhancers =
  process.env.NODE_ENV !== 'production' && composeWithDevTools !== undefined
    ? composeWithDevTools
    : compose;
const enhancer = composeEnhancers(applyMiddleware(thunk));

/** @type {import('redux').Store} */
const store = createStore(reducers, preloadedState, enhancer);
export default store;
