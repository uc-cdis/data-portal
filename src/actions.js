import 'isomorphic-fetch';
import _ from 'underscore';
import { requiredCerts, userapiPath, headers, basename, submissionApiOauthPath, graphqlPath } from './configs';
import { fetchProjects, fetchDictionary } from './queryactions';

export const updatePopup = state => ({
  type: 'UPDATE_POPUP',
  data: state,
});

export const fetchWrapper = ({ path, method = 'GET', body = null, handler, custom_headers, callback = () => (null) }) => (dispatch) => {
  const request = {
    credentials: 'same-origin',
    headers: { ...headers, ...custom_headers },
    method,
    body,
  };
  if ( method === 'DELETE' ) {
    // emulate failure
    return new Promise( (resolve,reject) => {
      setTimeout(
        () => {
          dispatch( handler( { status: 200, data: { error: "Frick jack" }, headers:{} } ) );
        }, 5000
      );
    });
  }
  return fetch(path, request).then(response => response.text().then((data) => {
    if (data) {
      try {
        data = JSON.parse(data);
      } catch (e) {
        // # do nothing
      }
    }
    dispatch(handler({ status: response.status, data, headers: response.headers }));
    callback();
    return Promise.resolve(data);
  })).catch((error) => {
    console.log(error);
    dispatch(connectionError());
  });
};

export const fetchGraphQL = (graphQLParams) => {
  const request = {
    credentials: 'same-origin',
    headers: { ...headers },
    method: 'POST',
    body: JSON.stringify(graphQLParams),
  };

  return fetch(graphqlPath, request).then(response => response.text()).then((responseBody) => {
    try {
      return JSON.parse(responseBody);
    } catch (error) {
      return responseBody;
    }
  });
};

export const handleResponse = type => ({ data, status }) => {
  switch (status) {
  case 200:
    return {
      type,
      data,
    };
  default:
    return {
      type: 'FETCH_ERROR',
      error: data,
    };
  }
};

export const unauthorizedError = () => ({
  type: 'REQUEST_ERROR',
  error: 'unauthorized',
});

export const connectionError = () => {
  console.log('connection error');
  return {
    type: 'REQUEST_ERROR',
    error: 'connection_error',
  };
};

export const receiveUser = ({ status, data }) => {
  switch (status) {
  case 200:
    return {
      type: 'RECEIVE_USER',
      user: data,
    };
  case 401:
    return {
      type: 'UPDATE_POPUP',
      data: { auth_popup: true },
    };
  default:
    return {
      type: 'FETCH_ERROR',
      error: data.error,
    };
  }
};

export const startFetchUser = () => {
};

export const fetchUser = () => fetchWrapper({
  path: `${userapiPath}user/`,
  handler: receiveUser,
});

export const requireAuth = (store, additionalHooks) => (nextState, replace, callback) => {
  window.scrollTo(0, 0);
  const resolvePromise = () => {
    const { user } = store.getState();
    const location = nextState.location;
    if (!user.username) {
      const path = location.pathname == '/' ? '/' : `/${location.pathname}`;
      replace({ pathname: '/login', query: { next: path + nextState.location.search } });
      return Promise.resolve();
    }
    const has_certs = _.intersection(requiredCerts, user.certificates_uploaded).length !== requiredCerts.length;
    // take quiz if this user doesn't have required certificate
    if (location.pathname !== 'quiz' && has_certs) {
      replace({ pathname: '/quiz' });
    } else if (location.pathname === 'quiz' && !has_certs) {
      replace({ pathname: '/' });
    } else if (additionalHooks) {
      return additionalHooks(nextState, replace);
    }
    return Promise.resolve();
  };
  store
    .dispatch(fetchUser())
    .then(resolvePromise)
    .then(() => callback());
};

export const enterHook = (store, hookAction) => (nextState, replace, callback) => store.dispatch(hookAction()).then(() => callback());

export const logoutAPI = () => dispatch => dispatch(fetchWrapper({
  path: `${submissionApiOauthPath}logout`,
  handler: receiveAPILogout,
})).then(() => document.location.replace(`${userapiPath}/logout?next=${basename}`));

export const fetchOAuthURL = oauth_path =>
// Get cloud_middleware's authorization url
  fetchWrapper({
    path: `${oauth_path}authorization_url`,
    handler: receiveAuthorizationUrl,
  })
;

export const receiveAuthorizationUrl = ({ status, data }) => {
  switch (status) {
  case 200:
    return {
      type: 'RECEIVE_AUTHORIZATION_URL',
      url: data,
    };
  default:
    return {
      type: 'FETCH_ERROR',
      error: data.error,
    };
  }
};

export const receiveAPILogout = handleResponse('RECEIVE_API_LOGOUT');
