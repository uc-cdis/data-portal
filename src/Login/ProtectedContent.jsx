import { useEffect, useState } from 'react';
import { useStore } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { fetchUser, fetchUserAccess } from '../actions';
import Spinner from '../components/Spinner';
import AuthPopup from './AuthPopup';
import { fetchLogin } from './ReduxLogin';

/** @typedef {import('redux-thunk').ThunkDispatch} ThunkDispatch */
/** @typedef {import('../types').UserState} UserState */
/** @typedef {{ user: UserState }} ReduxState */

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
 * @property {boolean} [isLoginPage] default false
 * @property {(location?: import('react-router').Location) => Promise} [preload] optional async function to run before rendering the child component, meant for fetching resources
 */

/**
 * Container for components that require authentication to access.
 *  @param {ProtectedContentProps} props
 */
function ProtectedContent({
  children,
  isAdminOnly = false,
  isLoginPage = false,
  preload,
}) {
  /** @type {{  dispatch: ThunkDispatch; getState: () => ReduxState }} */
  const reduxStore = useStore();

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
   * @param {ProtectedContentState} currentState
   */
  function checkLoginStatus(currentState) {
    const newState = /** @type {ProtectedContentState} */ ({
      ...currentState,
      authenticated: true,
      redirectTo: null,
      user: reduxStore.getState().user,
    });

    // assume we're still logged in after 1 minute ...
    if (Date.now() - newState.user.lastAuthMs < 60000)
      return Promise.resolve(newState);

    return reduxStore
      .dispatch(fetchUser()) // make an API call to see if we're still logged in ...
      .then(() => {
        newState.user = reduxStore.getState().user;
        if (!newState.user.username) {
          // not authenticated
          newState.redirectTo = '/login';
          newState.authenticated = false;
        } else {
          reduxStore.dispatch(fetchUserAccess());
        }
        return newState;
      });
  }

  /**
   * Check if user has access to portal, and update state accordingly.
   * @param {ProtectedContentState} currentState
   */
  function checkAccess(currentState) {
    const isUserRegistered =
      currentState.user.authz !== undefined &&
      Object.keys(currentState.user.authz).length > 0;
    const hasDocsToReview = currentState.user.docs_to_be_reviewed?.length > 0;
    const hasAccess = isUserRegistered && !hasDocsToReview;

    return location.pathname === '/' || hasAccess
      ? currentState
      : { ...currentState, redirectTo: '/' };
  }

  /**
   * Check if user is admin if needed, and update state accordingly.
   * @param {ProtectedContentState} currentState
   */
  function checkIfAdmin(currentState) {
    if (!isAdminOnly) return currentState;

    const resourcePath = '/services/sheepdog/submission/project';
    const isAdminUser =
      currentState.user.authz?.[resourcePath]?.[0].method === '*';
    return isAdminUser ? currentState : { ...currentState, redirectTo: '/' };
  }

  /** @param {ProtectedContentState} currentState */
  function updateState(currentState) {
    const newState = { ...currentState, dataLoaded: true };
    setState(newState);
  }
  useEffect(() => {
    window.scrollTo(
      0,
      /** @type {{ scrollY?: number }} */ (location?.state)?.scrollY ?? 0
    );

    reduxStore.dispatch({ type: 'CLEAR_COUNTS' }); // clear some counters
    reduxStore.dispatch({ type: 'CLEAR_QUERY_NODES' });

    if (isLoginPage)
      checkLoginStatus(state).then((newState) => {
        if (newState.authenticated)
          updateState({ ...newState, redirectTo: '/' });
        else
          reduxStore
            .dispatch(fetchLogin())
            .finally(() => updateState(newState));
      });
    else
      checkLoginStatus(state)
        .then(checkAccess)
        .then(checkIfAdmin)
        .then((newState) => {
          const shouldPreload =
            newState.authenticated && typeof preload === 'function';
          const shouldRedirect =
            newState.redirectTo && newState.redirectTo !== location.pathname;

          if (!shouldPreload || shouldRedirect) updateState(newState);
          else preload(location).finally(() => updateState(newState));
        });
  }, [location]);

  if (state.redirectTo && state.redirectTo !== location.pathname)
    return <Navigate to={state.redirectTo} replace />;
  if (isLoginPage && state.dataLoaded) return children;
  if (state.authenticated)
    return (
      <>
        <AuthPopup />
        {children}
      </>
    );
  return <Spinner />;
}

ProtectedContent.propTypes = {
  children: PropTypes.node.isRequired,
  isAdminOnly: PropTypes.bool,
  isLoginPage: PropTypes.bool,
  preload: PropTypes.func,
};

export default ProtectedContent;
