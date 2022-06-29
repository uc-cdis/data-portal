import {
  connectionError,
  fetchErrored,
  receiveDataVersion,
  receiveJobDispatch,
  receiveJobStatus,
  receiveProjects,
  receiveUser,
  receiveUserAccess,
  updatePopup,
} from './actions';
import {
  userapiPath,
  hostname,
  submissionApiPath,
  authzPath,
  guppyUrl,
  jobapiPath,
} from './localconf';
import { config } from './params';
import { fetchCreds, fetchWithCreds } from './utils.fetch';

/** @typedef {import('redux').AnyAction} AnyAction */
/** @typedef {import('redux').Dispatch} Dispatch */
/** @typedef {import('redux-thunk').ThunkDispatch} ThunkDispatch */

/* SLICE: KUBE */
/** @param {any} body */
export const dispatchJob = (body) => (/** @type {Dispatch} */ dispatch) =>
  fetchWithCreds({
    path: `${jobapiPath}dispatch`,
    body: JSON.stringify(body),
    method: 'POST',
    onError: () => dispatch(connectionError()),
  })
    .then(({ status, data }) => {
      switch (status) {
        case 200:
          return receiveJobDispatch(data);
        default:
          return fetchErrored(data);
      }
    }, fetchErrored)
    .then((msg) => {
      dispatch(msg);
    });

export const checkJobStatus =
  () =>
  /**
   * @param {Dispatch} dispatch
   * @param {() => ({ kube: import('./types').KubeState })} getState
   */
  (dispatch, getState) => {
    const state = getState();
    let jobId = null;
    if (state.kube.job) {
      jobId = state.kube.job.uid;
    }
    return fetchWithCreds({
      path: `${jobapiPath}status?UID=${jobId}`,
      method: 'GET',
      onError: () => dispatch(connectionError()),
    })
      .then(({ status, data }) => {
        // stop fetching job status once it stops running
        if (data.status !== 'Running') {
          window.clearInterval(state.kube.jobStatusInterval);
        }
        switch (status) {
          case 200: {
            const { resultURL, ...job } = data;
            return receiveJobStatus({ job, resultURL });
          }
          default:
            return fetchErrored(data);
        }
      }, fetchErrored)
      .then((msg) => {
        dispatch(msg);
      });
  };

/** @param {string} jobId */
export const fetchJobResult = (jobId) => (/** @type {Dispatch} */ dispatch) =>
  fetchWithCreds({
    path: `${jobapiPath}output?UID=${jobId}`,
    method: 'GET',
    onError: () => dispatch(connectionError()),
  }).then((data) => data);

/* SLICE: PROJECT */
/**
 * redux-thunk support asynchronous redux actions via 'thunks' -
 * lambdas that accept dispatch and getState functions as arguments
 */
export const fetchProjects =
  () =>
  /**
   * @param {Dispatch} dispatch
   * @param {() => { project: import('./types').ProjectState }} getState
   */
  (dispatch, getState) =>
    getState().project.projects
      ? Promise.resolve()
      : fetchWithCreds({
          path: `${submissionApiPath}graphql`,
          body: JSON.stringify({
            query:
              'query { project(first:0) {code, project_id, availability_type}}',
          }),
          method: 'POST',
        }).then(({ status, data }) => {
          if (status === 200) dispatch(receiveProjects(data.data.project));
          else dispatch(fetchErrored(data));
        });

/* SLICE: USER */
/** @param {import('./types').FetchHelperResult} result */
export const handleFetchUser = ({ status, data }) => {
  switch (status) {
    case 200:
      return receiveUser(data);
    case 401:
      return updatePopup({ authPopup: true });
    default:
      return fetchErrored(data.error);
  }
};

export const fetchUser = () => (/** @type {Dispatch} */ dispatch) =>
  fetchCreds({ onError: () => dispatch(connectionError()) }).then((res) =>
    dispatch(handleFetchUser(res))
  );

/** @param {boolean} displayAuthPopup */
export const logoutAPI =
  (displayAuthPopup = false) =>
  (/** @type {Dispatch} */ dispatch) =>
    fetch(
      `${userapiPath}/logout?next=${hostname}${
        process.env.NODE_ENV === 'development' ? 'dev.html' : ''
      }`
    ).then((response) => {
      if (displayAuthPopup) dispatch(updatePopup({ authPopup: true }));
      else document.location.replace(response.url);

      window.localStorage.clear();
      window.sessionStorage.clear();
    });

/* SLICE: USER ACCESS */
/**
 * Asks arborist which restricted access components the user has access to
 */
export const fetchUserAccess =
  () => async (/** @type {Dispatch} */ dispatch) => {
    /**
     * restricted access components and their associated arborist resources:
     * @type {{ [name: string]: { [key: string]: string } }}
     */
    const resourceMapping = config.componentToResourceMapping || {};
    const resourceNames = Object.keys(resourceMapping);

    const userAccessResults = await Promise.all(
      resourceNames.map((name) => {
        const { resource, method, service } = resourceMapping[name];
        return fetch(
          `${authzPath}?resource=${resource}&method=${method}&service=${service}`
        ).then(({ status, ok }) => {
          switch (status) {
            case 401: // user is not logged in
            case 403: // user is not allowed to access the resource
              return false;
            case 200: // valid input -> check "ok" field for authorization
              return ok;
            default:
              console.error(
                `Unknown status "${status}" returned by arborist call`
              );
              return false;
          }
        });
      })
    );

    /** @type {import('./types').UserAccessState['access']} */
    const userAccess = {};
    userAccessResults.forEach((hasAccess, i) => {
      userAccess[resourceNames[i]] = hasAccess;
    });

    dispatch(receiveUserAccess(userAccess));
  };

/* SLICE: VERSION INFO */
export const fetchVersionInfo = () => (/** @type {Dispatch} */ dispatch) =>
  fetchWithCreds({
    path: `${guppyUrl}/_data_version`,
    method: 'GET',
    useCache: true,
  }).then(({ status, data }) => {
    if (status === 200) dispatch(receiveDataVersion(data));
    else dispatch(fetchErrored(data));
  });
