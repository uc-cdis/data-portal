import fetch from 'isomorphic-fetch'
import { userapi_path, headers, basename, submissionapi_oauth_path } from '../configs.js'

export const updatePopup = (state) => {
  return {
    type: 'UPDATE_POPUP',
    data: state
  }
};

export const fetchWrapper = ({path, method='GET', body=null, handler, custom_headers, callback=()=>(null)}) => {
  return (dispatch) => {
    // console.log("fetch " + path)
    return fetch(path, {
      credentials: "same-origin",
      headers: {...headers, ...custom_headers},
      method: method,
      body: body,
    }).then(response => {
      return response.text().then(data => {
      if (data) {
        try {
            data = JSON.parse(data)
        }
        catch (e) {
          // # do nothing
        }
      }
        dispatch(handler({status: response.status, data: data, headers:response.headers}));
        callback();
        return Promise.resolve(data)
      })
    }).catch(error => {
      console.log(error);
      dispatch(connectionError())
    })
  }
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
          type:  'FETCH_ERROR',
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
    default:
      return {
        type: 'FETCH_ERROR',
        error: data['error']
      }
  }
};

// export const receiveUserAccess =

export const startFetchUser = () => {

};

export const fetchUser = () => {
  return fetchWrapper({
    path: userapi_path + "user/",
    handler: receiveUser
  })
};

export const requireAuth = (store, additionalHooks) => {
  return  (nextState, replace, callback) => {
    window.scrollTo(0, 0);
    store.dispatch(fetchUser()).then(() =>{
      let { user } = store.getState();
      let location = nextState.location;
      if (!user.username) {
        let path = location.pathname=='/' ? '/' : '/' + location.pathname;
        replace({ pathname: '/login', query: { next: path+nextState.location.search } });
      }
      if (additionalHooks){
        return additionalHooks(nextState, replace);
      }
      else {
        Promise.resolve()
      }
    }).then(()=>callback())
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
  })).then(()=>document.location.replace(userapi_path+'/logout?next='+basename))
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
