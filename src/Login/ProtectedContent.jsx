import React, { useEffect, useRef, useState } from 'react';
import { Redirect, useLocation, useRouteMatch } from 'react-router-dom';
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
import { isPageFullScreen } from '../utils';
import './ProtectedContent.css';

/**
 * @typedef {Object} ProtectedContentState
 * @property {boolean} authenticated
 * @property {boolean} dataLoaded
 * @property {?string} redirectTo
 * @property {?Object} user
 */

/**
 * @typedef {object} ProtectedContentProps
 * @property {React.ReactNode} children required child component
 * @property {boolean} [isAdminOnly] default false - if true, redirect to index page
 * @property {boolean} [isPublic] default false - set true to disable auth-guard
 * @property {() => Promise} [filter] optional filter to apply before rendering the child component
 */

const LOCATIONS_DICTIONARY = [
  '/dd',
  '/dd/:node',
  '/submission/map',
  '/:project',
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
  const match = useRouteMatch();

  /**
   * Start filter the 'newState' for the checkLoginStatus component.
   * Check if the user is logged in, and update state accordingly.
   * @param {Object} store
   * @param {import('redux-thunk').ThunkDispatch<any, any, Promise>} store.dispatch
   * @param {() => any} store.getState
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

    /** @type {{ dispatch: import('redux-thunk').ThunkDispatch}} */
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
   * @param {import('redux-thunk').ThunkDispatch} store.dispatch
   * @param {() => any} store.getState
   */
  function fetchResources({ dispatch, getState }) {
    const { graphiql, project, submission } = getState();
    const { path } = match;

    if (LOCATIONS_DICTIONARY.includes(path) && !submission.dictionary) {
      dispatch(fetchDictionary());
    } else if (LOCATIONS_PROJECTS.includes(path) && !project.projects) {
      dispatch(fetchProjects());
    } else if (LOCATIONS_SCHEMA.includes(path)) {
      if (!graphiql.schema) dispatch(fetchSchema());
      if (!graphiql.guppySchema) dispatch(fetchGuppySchema());
    }
  }

  const isMounted = useRef(false);
  /** @param {ProtectedContentState} currentState */
  function updateState(currentState) {
    if (isMounted.current) setState({ ...currentState, dataLoaded: true });
  }
  useEffect(() => {
    isMounted.current = true;
    window.scrollTo(0, 0);

    if (isMounted.current)
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
    return () => {
      isMounted.current = false;
    };
  }, [location]);

  if (state.redirectTo) return <Redirect to={state.redirectTo} />;

  const pageClassName = isPageFullScreen(location.pathname)
    ? 'protected-content protected-content--full-screen'
    : 'protected-content';
  return (
    <div className={pageClassName}>
      {(isPublic
        ? (state.dataLoaded || typeof filter !== 'function') && children
        : state.authenticated && (
            <>
              <ReduxAuthTimeoutPopup />
              {children}
            </>
          )) || <Spinner />}
    </div>
  );
}

ProtectedContent.propTypes = {
  children: PropTypes.node.isRequired,
  isAdminOnly: PropTypes.bool,
  isPublic: PropTypes.bool,
  filter: PropTypes.func,
};

export default ProtectedContent;
