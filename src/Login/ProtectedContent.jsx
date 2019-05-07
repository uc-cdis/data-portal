import React from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { fetchUser, fetchOAuthURL, fetchWithCreds, fetchProjects } from '../actions';
import Spinner from '../components/Spinner';
import getReduxStore from '../reduxStore';
import { requiredCerts, submissionApiOauthPath } from '../configs';
import ReduxAuthTimeoutPopup from '../Popup/ReduxAuthTimeoutPopup';
import { intersection, isPageFullScreen } from '../utils';
import './ProtectedContent.css';

let lastAuthMs = 0;
let lastTokenRefreshMs = 0;

/**
 * Redux listener - just clears auth-cache on logout
 */
export function logoutListener(state = {}, action) {
  switch (action.type) {
  case 'RECEIVE_API_LOGOUT':
    lastAuthMs = 0;
    lastTokenRefreshMs = 0;
    break;
  default: // noop
  }
  return state;
}

/**
 * Container for components that require authentication to access.
 * Takes a few properties
 * @param component required child component
 * @param location from react-router
 * @param history from react-router
 * @param match from react-router.match
 * @param public default false - set true to disable auth-guard
 * @param filter {() => Promise} optional filter to apply before rendering the child component
 */
class ProtectedContent extends React.Component {
  static propTypes = {
    component: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    match: PropTypes.shape(
      {
        params: PropTypes.object,
        path: PropTypes.string,
      },
    ).isRequired,
    public: PropTypes.bool,
    filter: PropTypes.func,
  };

  static defaultProps = {
    public: false,
    filter: null,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      authenticated: false,
      dataLoaded: false,
      redirectTo: null,
    };
  }

  /**
   * We start out in an unauthenticatd state - after mount do
   * the checks to see if the current session is authenticated
   * in the various ways we want it to be.
   */
  componentDidMount() {
    getReduxStore().then(
      store =>
        Promise.all(
          [
            store.dispatch({ type: 'CLEAR_COUNTS' }), // clear some counters
            store.dispatch({ type: 'CLEAR_QUERY_NODES' }),
          ],
        ).then(
          () => this.checkLoginStatus(store, this.state)
            .then(newState => this.props.public || this.checkQuizStatus(newState))
            .then(newState => this.props.public || this.checkApiToken(store, newState)),
        ).then(
          (newState) => {
            const filterPromise = (!this.props.public && newState.authenticated
              && typeof this.props.filter === 'function')
              ? this.props.filter()
              : Promise.resolve('ok');
            // finally update the component state
            const finish = () => {
              const latestState = Object.assign({}, newState);
              latestState.dataLoaded = true;
              this.setState(latestState);
            };
            return filterPromise.then(
              finish, finish,
            );
          },
        ),
    );
    if (this.props.public) {
      getReduxStore().then(
        (store) => {
          const filterPromise = (
            typeof this.props.filter === 'function')
            ? this.props.filter()
            : Promise.resolve('ok');
          // finally update the component state
          const finish = () => {
            const latestState = Object.assign({}, store);
            latestState.dataLoaded = true;
            this.setState(latestState);
          };
          return filterPromise.then(
            finish, finish,
          );
        },
      );
    }
  }

  /**
   * Start filter the 'newState' for the checkLoginStatus component.
   * Check if the user is logged in, and update state accordingly.
   * @method checkLoginStatus
   * @param {store} store
   * @param {initialState} initialState
   * @return Promise<{redirectTo, authenticated, user}>
   */
  checkLoginStatus = (store, initialState) => {
    const newState = Object.assign({}, initialState);
    const nowMs = Date.now();
    newState.authenticated = true;
    newState.redirectTo = null;
    newState.user = store.getState().user;

    if (nowMs - lastAuthMs < 60000) {
      // assume we're still logged in after 1 minute ...
      return Promise.resolve(newState);
    }

    return store.dispatch(fetchUser) // make an API call to see if we're still logged in ...
      .then(
        (response) => {
          const { user } = store.getState();
          newState.user = user;
          if (!user.username) { // not authenticated
            newState.redirectTo = '/login';
            newState.authenticated = false;
          } else if (response.type !== 'UPDATE_POPUP') {
            // auth ok - cache it
            lastAuthMs = Date.now();
          }
          return newState;
        },
      );
  };

  /**
   * Filter refreshes the gdc-api token (acquired via oauth with user-api) if necessary.
   * @method checkApiToken
   * @param store Redux store
   * @param initialState
   * @return newState passed through
   */
  checkApiToken = (store, initialState) => {
    const nowMs = Date.now();
    const newState = Object.assign({}, initialState);

    if (!newState.authenticated) {
      return Promise.resolve(newState);
    }
    if (nowMs - lastTokenRefreshMs < 41000) {
      return Promise.resolve(newState);
    }
    return store.dispatch(fetchProjects())
      .then((info) => {
        //
        // The assumption here is that fetchProjects either succeeds or fails.
        // If it fails (we won't have any project data), then we need to refresh our api token ...
        //
        const projects = store.getState().submission.projects;
        if (projects) {
          // user already has a valid token
          return Promise.resolve(newState);
        } else if (info.status !== 403 || info.status !== 401) {
          // do not authenticate unless we have a 403 or 401
          // should only check 401 after we fix fence to return correct
          // error code for all cases
          // there may be no tables at startup time,
          // or some other weirdness ...
          // The oauth dance below is only relevent for legacy commons - pre jwt
          return Promise.resolve(newState);
        }
        // else do the oauth dance
        // NOTE: this is DEPRECATED now - jwt access token
        //      works across all services
        return store.dispatch(fetchOAuthURL(submissionApiOauthPath))
          .then(
            oauthUrl => fetchWithCreds({ path: oauthUrl, dispatch: store.dispatch.bind(store) }))
          .then(
            ({ status, data }) => {
              switch (status) {
              case 200:
                return {
                  type: 'RECEIVE_SUBMISSION_LOGIN',
                  result: true,
                };
              default: {
                return {
                  type: 'RECEIVE_SUBMISSION_LOGIN',
                  result: false,
                  error: data,
                };
              }
              }
            },
          )
          .then(
            msg => store.dispatch(msg),
          )
          .then(
            // refetch the tables - since the earlier call failed with an invalid token ...
            () => store.dispatch(fetchProjects()),
          )
          .then(
            () => {
              lastTokenRefreshMs = Date.now();
              return newState;
            },
            () => {
              // something went wrong - better just re-login
              newState.authenticated = false;
              newState.redirectTo = '/login';
              return newState;
            },
          );
      });
  };

  /**
   * Filter the 'newState' for the ProtectedComponent.
   * User needs to take a security quiz before he/she can acquire tokens ...
   * something like that
   */
  checkQuizStatus = (initialState) => {
    const newState = Object.assign(initialState);

    if (!(newState.authenticated && newState.user && newState.user.username)) {
      return newState; // NOOP for unauthenticated session
    }
    const { user } = newState;
    // user is authenticated - now check if he has certs
    const isMissingCerts =
      intersection(requiredCerts, user.certificates_uploaded).length !== requiredCerts.length;
    // take quiz if this user doesn't have required certificate
    if (this.props.match.path !== '/quiz' && isMissingCerts) {
      newState.redirectTo = '/quiz';
      // do not update lastAuthMs (indicates time of last successful auth)
    } else if (this.props.match.path === '/quiz' && !isMissingCerts) {
      newState.redirectTo = '/';
    }
    return newState;
  };

  render() {
    const Component = this.props.component;
    let params = {}; // router params
    if (this.props.match) {
      params = this.props.match.params || {};
    }
    window.scrollTo(0, 0);
    const pageFullWidthClassModifier = isPageFullScreen(this.props.location.pathname) ? 'protected-content--full-screen' : '';
    if (this.state.redirectTo) {
      return (<Redirect to={this.state.redirectTo} />);
    } else if (this.props.public && (!this.props.filter || typeof this.props.filter !== 'function')) {
      return (
        <div className={`protected-content ${pageFullWidthClassModifier}`}>
          <Component params={params} location={this.props.location} history={this.props.history} />
        </div>
      );
    } else if (!this.props.public && this.state.authenticated) {
      return (
        <div className={`protected-content ${pageFullWidthClassModifier}`}>
          <ReduxAuthTimeoutPopup />
          <Component params={params} location={this.props.location} history={this.props.history} />
        </div>
      );
    } else if (this.props.public && this.state.dataLoaded) {
      return (
        <div className={`protected-content ${pageFullWidthClassModifier}`}>
          <Component params={params} location={this.props.location} history={this.props.history} />
        </div>
      );
    }
    return (<div className={`protected-content ${pageFullWidthClassModifier}`}><Spinner /></div>);
  }
}

export default ProtectedContent;
