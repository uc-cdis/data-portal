import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { ThemeProvider } from 'styled-components';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import 'react-select/dist/react-select.css';

import { requireAuth, enterHook, fetchUser } from './actions';
import Login from './Login/Login';
import AmbiHomepage from './Homepage/AmbiHomepage';
import ExplorerPage from './Explorer/ExplorerPage';
import QueryNode, { clearResultAndQuery } from './QueryNode/ReduxQueryNode';
import DataDictionary from './DataDictionary/ReduxDataDictionary';
import DataDictionaryNode from './DataDictionary/ReduxDataDictionaryNode';
import ProjectSubmission, { loginSubmissionAPI } from './Submission/ReduxProjectSubmission';
import UserProfile, { loginUserProfile, fetchAccess } from './UserProfile/ReduxUserProfile';
import CertificateQuiz from './Certificate/ReduxQuiz';
import GraphQLQuery, { fetchSchema } from './GraphQLEditor/ReduxGqlEditor';
import { fetchDictionary } from './queryactions';
import { app } from './localconf';
import browserHistory from './history';
import { theme } from './theme';
import { clearCounts } from './DataModelGraph/ReduxDataModelGraph';
import { asyncSetInterval, withBoxAndNav, withAuthTimeout } from './utils';
import { getReduxStore } from './reduxStore';


// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();


let initialized = false;

// render the app after the store is configured
async function init() {
  if (initialized) {
    console.log('WARNING: attempt to re-initialize application');
    return;
  }
  initialized = true;
  const store = await getReduxStore();

  asyncSetInterval(() => store.dispatch(fetchUser), 10000);

  const history = syncHistoryWithStore(browserHistory, store);
  history.listen(location => console.log(location.pathname));
  if (app !== 'gdc') {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <MuiThemeProvider>
            <Router history={history}>
              <Route path="/login" component={Login} />
              <Route
                path="/"
                onEnter={requireAuth(store, () => store.dispatch(loginSubmissionAPI()))}
                component={AmbiHomepage}
              />
              <Route
                path="/query"
                onEnter={
                  requireAuth(
                    store,
                    () => store.dispatch(loginSubmissionAPI())
                      .then(() => store.dispatch(clearCounts))
                      .then(() => store.dispatch(fetchSchema)),
                  )
                }
                component={withBoxAndNav(withAuthTimeout(GraphQLQuery))}
              />
              <Route
                path="/identity"
                onEnter={requireAuth(store, () => store.dispatch(loginUserProfile()))}
                component={withBoxAndNav(withAuthTimeout(UserProfile))}
              />
              <Route
                path="/quiz"
                onEnter={requireAuth(store)}
                component={withBoxAndNav(withAuthTimeout(CertificateQuiz))}
              />
              <Route
                path="/dd"
                onEnter={enterHook(store, fetchDictionary)}
                component={withBoxAndNav(DataDictionary)}
              />
              <Route
                path="/dd/:node"
                onEnter={enterHook(store, fetchDictionary)}
                component={withBoxAndNav(DataDictionaryNode)}
              />
              <Route
                exact
                path="/files"
                onEnter={
                  requireAuth(store,
                    nextState => store.dispatch(loginSubmissionAPI())
                      .then(() => store.dispatch(clearResultAndQuery(nextState))),
                  )
                }
                component={ExplorerPage}
              />
              <Route
                path="/:project"
                onEnter={
                  requireAuth(store,
                    () => store.dispatch(loginSubmissionAPI())
                      .then(() => store.dispatch(clearCounts)),
                  )
                }
                component={withBoxAndNav(withAuthTimeout(ProjectSubmission))}
              />
              <Route
                path="/:project/search"
                onEnter={requireAuth(store, nextState => store.dispatch(loginSubmissionAPI()).then(() => store.dispatch(clearResultAndQuery(nextState))))}
                component={withBoxAndNav(withAuthTimeout(QueryNode))}
              />
            </Router>
          </MuiThemeProvider>
        </ThemeProvider>
      </Provider>,
      document.getElementById('root'),
    );
  } else {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router history={history}>
            <Route path="/login" component={Login} />
            <Route
              path="/"
              onEnter={requireAuth(store, () => store.dispatch(fetchAccess()))}
              component={withBoxAndNav(withAuthTimeout(UserProfile))}
            />
          </Router>
        </ThemeProvider>
      </Provider>,
      document.getElementById('root'),
    );
  }
}
init();
