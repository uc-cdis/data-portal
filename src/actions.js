import fetch from 'isomorphic-fetch'
import _ from 'underscore';
import { required_certs, userapi_path, headers, basename, submissionapi_oauth_path, graphql_path } from './configs.js'
import { fetchProjects, fetchDictionary }  from './queryactions';

export const updatePopup = (state) => {
  return {
    type: 'UPDATE_POPUP',
    data: state
  }
};

export const fetchWrapper = ({path, method='GET', body=null, handler, custom_headers, callback=()=>(null)}) => {
  return (dispatch) => {
    let request = {
      credentials: "same-origin",
      headers: {...headers, ...custom_headers},
      method: method,
      body: body,
    }
    return fetch(path, request).then(response => {
      return response.text().then(data => {
        if (data) {
          try {
              data = JSON.parse(data)
          }
          catch (e) {
          // # do nothing
          }
        }
        dispatch(handler({status: response.status, data: data, headers: response.headers}));
        callback();
        return Promise.resolve(data)
      })
    }).catch(error => {
      console.log(error);
      dispatch(connectionError())
    })
  }
};

export const fetchGraphQL = (graphQLParams) => {
  let request = {
    credentials: "same-origin",
    headers: {...headers},
    method: 'POST',
    body: JSON.stringify(graphQLParams),
  };

  return fetch(graphql_path, request).then(function (response) {
    return response.text();
  }).then(function (responseBody) {
    try {
      return JSON.parse(responseBody);
    } catch (error) {
      return responseBody;
    }
  });
};

export const handleResponse = (type) => {
  return ({data, status}) => {
    switch (status) {
      case 200:
        return {
          type: type,
          data: data
        };
      default:
        return {
          type: 'FETCH_ERROR',
          error: data
        }
    }
  }
};

export const unauthorizedError = () => {
  return {
    type: 'REQUEST_ERROR',
    error: 'unauthorized'
  }
};

export const connectionError = () => {
  console.log('connection error');
  return {
    type: 'REQUEST_ERROR',
    error: 'connection_error'
  }
};

export const receiveUser = ({status, data}) => {
  switch (status) {
    case 200:
      return {
        type: 'RECEIVE_USER',
        user: data
      };
    case 401:
      return {
        type: 'UPDATE_POPUP',
        data: {auth_popup: true}
      }
    default:
      return {
        type: 'FETCH_ERROR',
        error: data['error']
      }
  }
};

export const startFetchUser = () => {
};

export const fetchUser = () => {
  return fetchWrapper({
    path: userapi_path + "user/",
    handler: receiveUser
  })
};

export const requireAuth = (store, additionalHooks) => {
  return (nextState, replace, callback) => {
    window.scrollTo(0, 0);
    const resolvePromise = () => {
      let { user } = store.getState();
      let location = nextState.location;
      if (!user.username) {
        let path = location.pathname == '/' ? '/' : '/' + location.pathname;
        replace({pathname: '/login', query: {next: path+nextState.location.search}});
        return Promise.resolve()
      }
      let has_certs = _.intersection(required_certs, user.certificates_uploaded).length !== required_certs.length;
      // take quiz if this user doesn't have required certificate
      if (location.pathname !== 'quiz' && has_certs) {
        replace({pathname: '/quiz'});
      } else if (location.pathname === 'quiz' && !has_certs) {
        replace({pathname: '/'});
      } else if (additionalHooks) {
        return additionalHooks(nextState, replace);
      }
      return Promise.resolve()
    };
    store
      .dispatch(fetchUser())
      .then(resolvePromise)
      .then(() => callback())
  }
};

export const enterHook = (store, hookAction) => {
  return (nextState, replace, callback) => {
    return store.dispatch(hookAction()).then(() => callback());
  }
}

export const logoutAPI = () => {
  return (dispatch) => dispatch(fetchWrapper({
    path: submissionapi_oauth_path + 'logout',
    handler: receiveAPILogout,
  })).then(() => document.location.replace(userapi_path+'/logout?next='+basename))
};

export const fetchOAuthURL = (oauth_path) => {
// Get cloud_middleware's authorization url
  return fetchWrapper({
    path: oauth_path + "authorization_url",
    handler: receiveAuthorizationUrl
  })
};

export const receiveAuthorizationUrl = ({status, data}) => {
  switch (status) {
    case 200:
      return {
        type: 'RECEIVE_AUTHORIZATION_URL',
        url: data
      };
    default:
      return {
        type: 'FETCH_ERROR',
        error: data['error']
      }
  }
};

export const receiveAPILogout = handleResponse('RECEIVE_API_LOGOUT');
