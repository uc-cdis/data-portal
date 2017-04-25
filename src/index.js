import React from 'react'
import QueryNode from './data/QueryNode'
import { clearResultAndQuery } from './data/QueryNodeActions'
import { render } from 'react-dom'
import GraphiQL from 'graphiql';
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import reducers from './data/reducers'
import { requireAuth, fetchUser } from './data/actions'
import App from './data/App'
import Login from './data/Login'
import Submission from './data/submission.js'
import ProjectSubmission from './data/ProjectSubmission.js'
import IdentityAccess from './data/IdentityAccesses.js'
// import { fetchInstances, fetchUrlAndLogin } from './compute/ComputeActions'
import { loginSubmissionAPI, setProject } from './data/submitActions'
import { loginCloudMiddleware } from './data/AccessActions'
import { Router, Route, Link, useRouterHistory } from 'react-router'
import { routerMiddleware, syncHistoryWithStore, routerReducer } from 'react-router-redux'
import { createHistory } from 'history'
import 'react-select/dist/react-select.css';
import { basename, dev } from './localconf.js';
import { ThemeProvider } from 'styled-components';
import { theme, Box } from './theme';

console.log(dev);
const browserHistory = useRouterHistory(createHistory)({
basename: basename
});

let store;
if ( dev == true) {
  store = applyMiddleware(thunk, routerMiddleware(browserHistory))(createStore)(
    reducers,
    {user: {}, status: {}},
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  )
}
else {
  store = applyMiddleware(thunk, routerMiddleware(browserHistory))(createStore)(
    reducers,
    {user: {}, status: {}},
  )
}

const NoMatch = () => (
<div>
<Link to={`/`}>Page Not Found</Link>
</div>
);


const history = syncHistoryWithStore(browserHistory, store);


// store.dispatch(fetchUser())

setInterval(() => store.dispatch(fetchUser()), 10000);
// keep the cloud middleware's session activated
// setInterval(() => store.dispatch(fetchUrlAndLogin()), 10000)
render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <Router history={history}>
        <Route path='/login' component={Login} />
        <Route path='/' onEnter={requireAuth(store, ()=>store.dispatch(loginSubmissionAPI()))} component={Submission} />
        <Route path='/identity'
               onEnter={requireAuth(store, ()=>store.dispatch(loginCloudMiddleware()))}
               component={IdentityAccess} />
        <Route path='/:project'
               onEnter={requireAuth(store, ()=>store.dispatch(loginSubmissionAPI()))}
               component={ProjectSubmission} />
        <Route path='/:project/search'
          onEnter={requireAuth(store, (nextState)=>{return store.dispatch(loginSubmissionAPI()).then(() => store.dispatch(clearResultAndQuery(nextState)))})}
               component={QueryNode} />
      </Router>
    </ThemeProvider>
  </Provider>,
  document.getElementById('root')
);

history.listen(location => console.log(location.pathname));
