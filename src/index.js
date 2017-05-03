import React from 'react'
import { dict } from './dictionary.js';
import QueryNode from './data/QueryNode'
import { clearResultAndQuery } from './data/QueryNodeActions'
import { render } from 'react-dom'
import GraphiQL from 'graphiql';
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import reducers from './data/reducers'
import { requireAuth, enterHook, fetchUser } from './data/actions'
import App from './data/App'
import Login from './data/Login'
import DataDictionary from './data/DataDictionary.js'
import DataDictionaryNode from './data/DataDictionaryNode.js'
import Submission from './data/submission.js'
import ProjectSubmission from './data/ProjectSubmission.js'
import IdentityAccess from './data/IdentityAccess/component.js'
import { loginSubmissionAPI, setProject } from './data/submitActions'
import { fetchDictionary } from './data/queryactions.js';
import { loginCloudMiddleware, fetchStorageAccess } from './data/IdentityAccess/actions'
import { Router, Route, Link, useRouterHistory } from 'react-router'
import { routerMiddleware, syncHistoryWithStore, routerReducer } from 'react-router-redux'
import { createHistory } from 'history'
import 'react-select/dist/react-select.css';
import { app, mock_store, basename, dev } from './localconf.js';
import { ThemeProvider } from 'styled-components';
import { theme, Box } from './theme';


console.log(dev);
const browserHistory = useRouterHistory(createHistory)({
basename: basename
});

let store;
if (dev===true) {
  let data = {};
  if (mock_store) {
    data = {user: {username: "test"}, submission:{dictionary:dict, node_types: Object.keys(dict).slice(2,) }, status: {}};
  }
  store = applyMiddleware(thunk, routerMiddleware(browserHistory))(createStore)(
    reducers,
    data,
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
if (app==='bpa'){
render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <Router history={history}>
        <Route path='/login' component={Login} />
        <Route path='/' onEnter={requireAuth(store, ()=>store.dispatch(loginSubmissionAPI()))} component={Submission} />
        <Route path='/identity'
               onEnter={requireAuth(store, ()=>store.dispatch(loginCloudMiddleware()))}
               component={IdentityAccess} />
        <Route path='/dd'
               onEnter={enterHook(store, fetchDictionary)}
               component={DataDictionary} />
        <Route path='/dd/:node'
               onEnter={enterHook(store, fetchDictionary)}
               component={DataDictionaryNode} />
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

} 
else {
render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <Router history={history}>
        <Route path='/login' component={Login} />
        <Route path='/'
               onEnter={requireAuth(store, ()=>store.dispatch(fetchStorageAccess()))}
               component={IdentityAccess} />
      </Router>
    </ThemeProvider>
  </Provider>,
  document.getElementById('root')
);

}

history.listen(location => console.log(location.pathname));
