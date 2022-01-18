import { useEffect, useState } from 'react';
import { matchPath, Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  fetchDictionary,
  fetchProjects,
  fetchSchema,
  fetchGuppySchema,
  fetchUser,
  fetchUserAccess,
} from '../actions';
import Spinner from '../components/Spinner';
import getReduxStore from '../reduxStore';
import ReduxAuthTimeoutPopup from '../Popup/ReduxAuthTimeoutPopup';

/** @typedef {import('redux-thunk').ThunkDispatch} ThunkDispatch */
/** @typedef {import('../types').ProjectState} ProjectState */
/** @typedef {import('../types').UserState} UserState */
/** @typedef {import('../GraphQLEditor/types').GraphiqlState} GraphiqlState */
/** @typedef {import('../Submission/types').SubmissionState} SubmissionState */

/**
 * @typedef {Object} ProtectedContentState
 * @property {boolean} authenticated
 * @property {boolean} dataLoaded
 * @property {string} redirectTo
 * @property {UserState} user
 */

/**
 * @typedef {object} ProtectedContentProps
 * @property {JSX.Element} children required child component
 * @property {boolean} [isAdminOnly] default false - if true, redirect to index page
 * @property {boolean} [isPublic] default false - set true to disable auth-guard
 * @property {() => Promise} [filter] optional filter to apply before rendering the child component
 */

const LOCATIONS_DICTIONARY = [
  '/dd/*',
  '/submission/map',
  '/submission/:project/*',
];
const LOCATIONS_PROJECTS = ['/files/*'];
const LOCATIONS_SCHEMA = ['/query'];

/**
 * Container for components that require authentication to access.
 *  @param {ProtectedContentProps} props
 */
function ProtectedContent({
  children,
  isAdminOnly = false,
  isPublic = false,
  filter,
}) {
  /** @type {ProtectedContentState} */
  const initialState = {
    authenticated: false,
    dataLoaded: false,
    redirectTo: null,
    user: null,
  };
  const [state, setState] = useState(initialState);
  const location = useLocation();

  /**
   * Start filter the 'newState' for the checkLoginStatus component.
   * Check if the user is logged in, and update state accordingly.
   * @param {Object} store
   * @param {ThunkDispatch} store.dispatch
   * @param {() => { user: UserState }} store.getState
   * @param {ProtectedContentState} currentState
   * @returns {Promise<ProtectedContentState>}
   */
  function checkLoginStatus(store, currentState) {
    const newState = {
      ...currentState,
      authenticated: true,
      redirectTo: null,
      user: store.getState().user,
    };

    // assume we're still logged in after 1 minute ...
    if (Date.now() - newState.user.lastAuthMs < 60000)
      return Promise.resolve(newState);

    return store
      .dispatch(fetchUser()) // make an API call to see if we're still logged in ...
      .then(() => {
        newState.user = store.getState().user;
        if (!newState.user.username) {
          // not authenticated
          newState.redirectTo = '/login';
          newState.authenticated = false;
        } else {
          store.dispatch(fetchUserAccess());
        }
        return newState;
      });
  }

  /**
   * Check if user is registered, and update state accordingly.
   * @param {ProtectedContentState} currentState
   * @returns {ProtectedContentState}
   */
  function checkIfRegisterd(currentState) {
    const isUserRegistered =
      currentState.user.authz !== undefined &&
      Object.keys(currentState.user.authz).length > 0;

    return location.pathname === '/' || isUserRegistered
      ? currentState
      : { ...currentState, redirectTo: '/' };
  }

  /**
   * Check if user is admin if needed, and update state accordingly.
   * @param {ProtectedContentState} currentState
   * @returns {ProtectedContentState}
   */
  function checkIfAdmin(currentState) {
    if (!isAdminOnly) return currentState;

    const resourcePath = '/services/sheepdog/submission/project';
    const isAdminUser =
      currentState.user.authz?.[resourcePath]?.[0].method === '*';
    return isAdminUser ? currentState : { ...currentState, redirectTo: '/' };
  }

  /**
   * Fetch resources on demand based on path
   * @param {Object} store
   * @param {ThunkDispatch} store.dispatch
   * @param {() => { graphiql: GraphiqlState; project: ProjectState; submission: SubmissionState }} store.getState
   */
  function fetchResources({ dispatch, getState }) {
    const { graphiql, project, submission } = getState();
    /** @param {string[]} patterns */
    function matchPathOneOf(patterns) {
      return patterns.some((pattern) => matchPath(pattern, location.pathname));
    }

    if (matchPathOneOf(LOCATIONS_DICTIONARY) && !submission.dictionary) {
      dispatch(fetchDictionary());
    } else if (matchPathOneOf(LOCATIONS_PROJECTS) && !project.projects) {
      dispatch(fetchProjects());
    } else if (matchPathOneOf(LOCATIONS_SCHEMA)) {
      if (!graphiql.schema) dispatch(fetchSchema());
      if (!graphiql.guppySchema) dispatch(fetchGuppySchema());
    }
  }

  /** @param {ProtectedContentState} currentState */
  function updateState(currentState) {
    const newState = { ...currentState, dataLoaded: true };
    if (isPublic) newState.redirectTo = null;
    setState(newState);
  }
  useEffect(() => {
    window.scrollTo(
      0,
      /** @type {{ scrollY?: number }} */ (location?.state)?.scrollY ?? 0
    );

    getReduxStore().then((store) =>
      Promise.all([
        store.dispatch({ type: 'CLEAR_COUNTS' }), // clear some counters
        store.dispatch({ type: 'CLEAR_QUERY_NODES' }),
      ]).then(() => {
        if (isPublic)
          if (typeof filter === 'function')
            filter().finally(() => updateState(state));
          else updateState(state);
        else
          checkLoginStatus(store, state)
            .then(checkIfRegisterd)
            .then(checkIfAdmin)
            .then((newState) => {
              if (newState.authenticated && typeof filter === 'function')
                filter().finally(() => {
                  updateState(newState);
                  fetchResources(store);
                });
              else {
                updateState(newState);
                fetchResources(store);
              }
            });
      })
    );
  }, [location]);

  if (state.redirectTo) return <Navigate to={state.redirectTo} replace />;
  if (isPublic && (state.dataLoaded || typeof filter !== 'function'))
    return children;
  if (state.authenticated)
    return (
      <>
        <ReduxAuthTimeoutPopup />
        {children}
      </>
    );
  return <Spinner />;
}

ProtectedContent.propTypes = {
  children: PropTypes.node.isRequired,
  isAdminOnly: PropTypes.bool,
  isPublic: PropTypes.bool,
  filter: PropTypes.func,
};

export default ProtectedContent;
