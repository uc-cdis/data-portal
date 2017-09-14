import React from 'react';
import Relay from 'react-relay/classic';
import { dict } from './dictionary.js';
import { persistStore, autoRehydrate } from 'redux-persist';
import { render } from 'react-dom';
import GraphiQL from 'graphiql';
import { Provider } from 'react-redux';
import { requireAuth, enterHook, fetchUser } from './actions';
import { clearResultAndQuery } from './QueryNode/actions';
import Login from './Login/component';
import RelayHomepage from './Homepage/RelayHomepage';
import QueryNode from './QueryNode/component';
import RelayExplorer, {ExplorerQuery} from './Explorer/component';
import DataDictionary from './DataDictionary/component';
import DataDictionaryNode from './DataDictionary/DataDictionaryNode';
import ProjectSubmission from './Submission/component';
import UserProfile from './UserProfile/component.js';
import Certificate from './Certificate/component.js';
import GraphQLQuery from "./GraphQLEditor/component";
import { loginSubmissionAPI, setProject } from './Submission/actions';
import { fetchDictionary } from './queryactions.js';
import { loginUserProfile, fetchAccess } from './UserProfile/actions';
import { fetchSchema } from './GraphQLEditor/actions';

import { Router, Route, Link, applyRouterMiddleware } from 'react-router';
import { routerMiddleware, syncHistoryWithStore, routerReducer } from 'react-router-redux';
/**
 * NOTE: react-router-relay does not support relay modern (relay 1.+) - 
 * only relay "classic" - see https://github.com/relay-tools/react-router-relay
 */
import useRelay from 'react-router-relay'

import 'react-select/dist/react-select.css';
import { app, mock_store, dev, graphql_path } from './localconf.js';
import { ThemeProvider } from 'styled-components';
import browserHistory from './history';
import { theme, Box } from './theme';
import { clearCounts } from './DataModelGraph/actions'
import { asyncSetInterval, withBoxAndNav, withAuthTimeout } from './utils';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import injectTapEventPlugin from 'react-tap-event-plugin';
import { getReduxStore } from './reduxStore.js';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();



const NoMatch = () => (
  <div>
    <Link to={`/`}>Page Not Found</Link>
  </div>
);

Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer(graphql_path,
    {credentials: 'same-origin'})
);

const homepageQueries = { 
  viewer: () => Relay.QL`query { viewer }`,  
};

/**
 * Relay route supporting PTBRelayAdapter below -
 * sets up per-project graphql query
 */
class ExplorerRoute extends Relay.Route {
  static paramDefinitions = {
    selected_projects: { required: true },
    selected_file_formats: { required: true }
  };

  static queries = {
    viewer: () => Relay.QL`
        query {
            viewer
        }
    `
  };

  static routeName = "ExplorerRoute"
}


let initialized = false;

// render the app after the store is configured
async function init() {
  if ( initialized ) {
    console.log( "WARNING: attempt to re-initialize application" );
    return;
  }
  initialized = true;
  const store = await getReduxStore();

  // not necessary to wait for this? ... await store.dispatch( fetchUser() );
  asyncSetInterval( () => store.dispatch(fetchUser()), 10000 );
  
  const history = syncHistoryWithStore(browserHistory, store);
  history.listen(location => console.log(location.pathname));
  if (app !== 'gdc') {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
        <MuiThemeProvider>
          <Router history={history} environment={Relay.Store}
                  render={applyRouterMiddleware(useRelay)}
                  >
            <Route path='/login' component={Login} />
            <Route path='/' onEnter={requireAuth(store, () => store.dispatch(loginSubmissionAPI()))}
                   component={RelayHomepage}
                   queries={homepageQueries} />
            <Route path='/query'
                   onEnter={requireAuth(store, () => store.dispatch(loginSubmissionAPI()).then(() => store.dispatch(clearCounts()))
                     .then(() => store.dispatch(fetchSchema())))}
                   component={withBoxAndNav(withAuthTimeout(GraphQLQuery))} />
            <Route path='/identity'
              onEnter={requireAuth(store, () => store.dispatch(loginUserProfile()))}
              component={withBoxAndNav(withAuthTimeout(UserProfile))} />
            <Route path='/quiz'
              onEnter={requireAuth(store)}
              component={withBoxAndNav(withAuthTimeout(Certificate))} />
            <Route path='/dd'
              onEnter={enterHook(store, fetchDictionary)}
              component={withBoxAndNav(DataDictionary)} />
            <Route path='/dd/:node'
              onEnter={enterHook(store, fetchDictionary)}
              component={withBoxAndNav(DataDictionaryNode)} />
            <Route path='/files'
              onEnter={requireAuth(store, (nextState) => { return store.dispatch(loginSubmissionAPI()).then(() => store.dispatch(clearResultAndQuery(nextState))); })}
              component={RelayExplorer}
              queries={homepageQueries}/>
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
              onEnter={requireAuth(store, () => store.dispatch(fetchAccess()))}
              component={withBoxAndNav(withAuthTimeout(UserProfile))} />
          </Router>
        </ThemeProvider>
      </Provider>,
    document.getElementById('root')
  );
  }
}
init();
