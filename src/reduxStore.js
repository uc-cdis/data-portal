import { dict } from './dictionary.js';
import { app, mock_store, dev, graphql_path } from './localconf.js';
import browserHistory from './history';
import { persistStore, autoRehydrate } from 'redux-persist';
import { createStore, applyMiddleware, compose } from 'redux';
import reducers from './reducers';
import { required_certs } from './configs';
import { routerMiddleware, syncHistoryWithStore, routerReducer } from 'react-router-redux';
import thunk from 'redux-thunk';



let store;
let storePromise;



/**
 * Little lazy redux store singleton factory.
 * We want some Relayjs adapters to also update the Redux store,
 * so it's handy to be able to access the store outside of
 * the normal react-redux 'connect' mechanism.
 * 
 * @return Promise<Store>
 */
export const getReduxStore = function () {
  if ( store ) { // singleton
    return Promise.resolve(store);
  }
  if ( storePromise ) { // store setup is in process 
    return storePromise; 
  }
  storePromise = new Promise((resolve, reject) => {
    try {
      if (dev === true) {
        let data = {};
        if (mock_store) {
          data = {user: {username: 'test', certificates_uploaded: required_certs }, submission: {dictionary: dict, node_types: Object.keys(dict).slice(2) }, status: {}};
        }
        const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
        store = compose(applyMiddleware(thunk, routerMiddleware(browserHistory)), autoRehydrate())(createStore)(
          reducers,
          data,
          window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
        );
      }
      else {
        store = compose(applyMiddleware(thunk, routerMiddleware(browserHistory)), autoRehydrate())(createStore)(
          reducers,
          {user: {}, status: {}},
          autoRehydrate()
        );
      }
      
      const persister = persistStore(store, { whitelist: ['certificate']}, () => { console.log('rehydration complete'); resolve(store)});
    } catch (e) {
      reject(e);
    }
  });
  return storePromise;
}
