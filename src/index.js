import React from 'react';
import Relay from 'react-relay';
import { dict } from './dictionary.js';
import { persistStore, autoRehydrate } from 'redux-persist';
import { render } from 'react-dom';
import GraphiQL from 'graphiql';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import reducers from './reducers';
import { requireAuth, enterHook, fetchUser } from './actions';
import { clearResultAndQuery } from './QueryNode/actions';
import Login from './Login/component';
import QueryNode from './QueryNode/component';
import DataDictionary from './DataDictionary/component';
import DataDictionaryNode from './DataDictionary/DataDictionaryNode';
import Submission from './App/component';
import ProjectSubmission from './Submission/component';
import IdentityAccess from './IdentityAccess/component.js';
import Certificate from './Certificate/component.js';
import GraphQLQuery from "./GraphQLEditor/component";
import { loginSubmissionAPI, setProject, loginAPI } from './Submission/actions';
import { fetchDictionary } from './queryactions.js';
import { loginCloudMiddleware, fetchStorageAccess } from './IdentityAccess/actions';
import { Router, Route, Link, applyRouterMiddleware } from 'react-router';
import { routerMiddleware, syncHistoryWithStore, routerReducer } from 'react-router-redux';
import 'react-select/dist/react-select.css';
import { app, mock_store, dev, graphql_path } from './localconf.js';
import { ThemeProvider } from 'styled-components';
import browserHistory from './history';
import { theme, Box } from './theme';
import { clearCounts } from './DataModelGraph/actions'
import { required_certs } from './configs';
import { withBoxAndNav, withAuthTimeout } from './utils';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import useRelay from 'react-router-relay'


let store;
const configureStore = () => {
  return new Promise((resolve, reject) => {
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

      setInterval(() => store.dispatch(fetchUser()), 10000);
      const persister = persistStore(store, { whitelist: ['certificate']}, () => { console.log('rehydration complete'); resolve(store)});
    } catch (e) {
      reject(e);
    }
  });
}


const NoMatch = () => (
  <div>
    <Link to={`/`}>Page Not Found</Link>
  </div>
);

Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer(graphql_path,
    {credentials: 'same-origin'})
);

const ViewerQueries = { viewer: () => Relay.QL`query { viewer }` }

// render the app after the store is configured
async function init() {
  const store = await configureStore();
  const history = syncHistoryWithStore(browserHistory, store);
  history.listen(location => console.log(location.pathname));
  if (app !== 'gdc') {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
        <MuiThemeProvider>
          <Router history={history} environment={Relay.Store}
                  render={applyRouterMiddleware(useRelay)}
                  forceFetch>
            <Route path='/login' component={Login} />
            <Route path='/' onEnter={requireAuth(store, () => store.dispatch(loginAPI()))}
                   component={Submission}
                   queries={ViewerQueries} />
            <Route path='/query'
                   onEnter={requireAuth(store, () => store.dispatch(loginSubmissionAPI()).then(() => store.dispatch(clearCounts())))}
                   component={GraphQLQuery} />
            <Route path='/identity'
              onEnter={requireAuth(store, () => store.dispatch(loginCloudMiddleware()))}
              component={withBoxAndNav(withAuthTimeout(IdentityAccess))} />
            <Route path='/quiz'
              onEnter={requireAuth(store)}
              component={withBoxAndNav(withAuthTimeout(Certificate))} />
            <Route path='/dd'
              onEnter={enterHook(store, fetchDictionary)}
              component={withBoxAndNav(DataDictionary)} />
            <Route path='/dd/:node'
              onEnter={enterHook(store, fetchDictionary)}
              component={withBoxAndNav(DataDictionaryNode)} />
            <Route path='/:project'
              onEnter={requireAuth(store, () => store.dispatch(loginSubmissionAPI()).then(() => store.dispatch(clearCounts())))}
              component={withBoxAndNav(withAuthTimeout(ProjectSubmission))} />
            <Route path='/:project/search'
              onEnter={requireAuth(store, (nextState) => { return store.dispatch(loginSubmissionAPI()).then(() => store.dispatch(clearResultAndQuery(nextState))); })}
              component={withBoxAndNav(withAuthTimeout(QueryNode))} />
          </Router>
         </MuiThemeProvider> 
        </ThemeProvider>
      </Provider>,
    document.getElementById('root')
  );
  } else {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router history={history}>
            <Route path='/login' component={Login} />
            <Route path='/'
              onEnter={requireAuth(store, () => store.dispatch(fetchStorageAccess()))}
              component={withBoxAndNav(withAuthTimeout(IdentityAccess))} />
          </Router>
        </ThemeProvider>
      </Provider>,
    document.getElementById('root')
  );
  }
}
init();
