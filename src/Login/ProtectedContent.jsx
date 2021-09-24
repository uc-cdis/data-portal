import React from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  fetchUser,
  fetchProjects,
  displaySystemUseNotice,
} from '../actions';
import Spinner from '../components/Spinner';
import getReduxStore from '../reduxStore';
import { requiredCerts } from '../configs';
import ReduxAuthTimeoutPopup from '../Popup/ReduxAuthTimeoutPopup';
import ReduxSystemUseWarningPopup from '../Popup/SystemUseWarningPopup';
import { intersection, isPageFullScreen } from '../utils';
import './ProtectedContent.css';

let lastAuthMs = 0;

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
  constructor(props, context) {
    super(props, context);
    this.state = {
      authenticated: false,
      dataLoaded: false,
      redirectTo: null,
      from: null,
    };
  }

  /**
   * We start out in an unauthenticated state - after mount do
   * the checks to see if the current session is authenticated
   * in the various ways we want it to be.
   */
  componentDidMount() {
    getReduxStore()
      .then(
        (store) => Promise.all(
          [
            store.dispatch({ type: 'CLEAR_COUNTS' }), // clear some counters
            store.dispatch({ type: 'CLEAR_QUERY_NODES' }),
          ],
        )
          .then(
            () => this.checkUseWarning(store, this.state), // check for existence of cookie to popup Use Warning
          )
          .then(
            () => this.checkLoginStatus(store, this.state)
              .then((newState) => this.props.public || this.checkQuizStatus(newState))
              .then((newState) => this.props.public || this.checkApiToken(store, newState)),
          )
          .then(
            (newState) => {
              const filterPromise = (!this.props.public && newState.authenticated
                && typeof this.props.filter === 'function')
                ? this.props.filter()
                : Promise.resolve('ok');
              // finally update the component state
              const finish = () => {
                const latestState = { ...newState };
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
      getReduxStore()
        .then(
          (store) => {
            const filterPromise = (
              typeof this.props.filter === 'function')
              ? this.props.filter()
              : Promise.resolve('ok');
            // finally update the component state
            const finish = () => {
              const latestState = { ...store };
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
    const newState = { ...initialState };
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
            newState.from = this.props.location; // save previous location
          } else if (response.type !== 'UPDATE_POPUP') {
            // auth ok - cache it
            lastAuthMs = Date.now();
          }
          return newState;
        },
      );
  };

  checkUseWarning = (store, initialState) => {
    const newState = { ...initialState };
    store.dispatch(displaySystemUseNotice());
    return newState;
  };

  /**
   * Filter refreshes the gdc-api token (acquired via oauth with user-api) if necessary.
   * @method checkApiToken
   * @param store Redux store
   * @param initialState
   * @return newState passed through
   */
  checkApiToken = (store, initialState) => {
    const newState = { ...initialState };

    if (!newState.authenticated) {
      return Promise.resolve(newState);
    }
    return store.dispatch(fetchProjects())
      .then((info) => {
        //
        // The assumption here is that fetchProjects either succeeds or fails.
        // If it fails (we won't have any project data), then we need to refresh our api token ...
        //
        const { projects } = store.getState().submission;
        if (projects) {
          // user already has a valid token
          return Promise.resolve(newState);
        }
        if (info.status !== 403 || info.status !== 401) {
          // do not authenticate unless we have a 403 or 401
          // should only check 401 after we fix fence to return correct
          // error code for all cases
          // there may be no tables at startup time,
          // or some other weirdness ...
          return Promise.resolve(newState);
        }
        // something went wrong - better just re-login
        newState.authenticated = false;
        newState.redirectTo = '/login';
        newState.from = this.props.location;
        return Promise.resolve(newState);
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
    const isMissingCerts = intersection(requiredCerts, user.certificates_uploaded).length !== requiredCerts.length;
    // take quiz if this user doesn't have required certificate
    if (this.props.match.path !== '/quiz' && isMissingCerts) {
      newState.redirectTo = '/quiz';
      newState.from = this.props.location;
      // do not update lastAuthMs (indicates time of last successful auth)
    } else if (this.props.match.path === '/quiz' && !isMissingCerts) {
      newState.redirectTo = '/';
      newState.from = this.props.location;
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
      let fromURL = '/';
      if (this.state.from && this.state.from.pathname) {
        fromURL = this.state.from.pathname;
        if (this.state.from.search && this.state.from.search !== '') {
          fromURL = fromURL.concat(this.state.from.search);
        }
      }
      return (
        <Redirect to={{
          pathname: this.state.redirectTo,
          from: fromURL,
        }}
        />
      );
    }

    if (this.props.public && (!this.props.filter || typeof this.props.filter !== 'function')) {
      return (

        <div className={`protected-content ${pageFullWidthClassModifier}`}>
          <ReduxSystemUseWarningPopup />
          <Component params={params} location={this.props.location} history={this.props.history} />
        </div>
      );
    }
    if (!this.props.public && this.state.authenticated) {
      return (
        <div className={`protected-content ${pageFullWidthClassModifier}`}>
          <ReduxSystemUseWarningPopup />
          <ReduxAuthTimeoutPopup />
          <Component params={params} location={this.props.location} history={this.props.history} />
        </div>
      );
    }
    if (this.props.public && this.state.dataLoaded) {
      return (
        <div className={`protected-content ${pageFullWidthClassModifier}`}>
          <ReduxSystemUseWarningPopup />
          <Component params={params} location={this.props.location} history={this.props.history} />
        </div>
      );
    }
    return (<div className={`protected-content ${pageFullWidthClassModifier}`}>       <ReduxSystemUseWarningPopup /> <Spinner /></div>);
  }
}

ProtectedContent.propTypes = {
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

ProtectedContent.defaultProps = {
  public: false,
  filter: null,
};

export default ProtectedContent;
