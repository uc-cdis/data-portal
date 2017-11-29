import React from 'react';
import { Redirect } from 'react-router-dom';

import { fetchUser, fetchOAuthURL, fetchJsonOrText } from '../actions';
import Spinner from '../components/Spinner';
import { getReduxStore } from '../reduxStore';
import { requiredCerts, submissionApiOauthPath } from '../configs';
import { fetchProjects } from '../queryactions';


let lastAuthMs = 0;

/**
 * Avoid importing underscore just for this ... export for testing
 * @method intersection
 * @param aList {Array<String>}
 * @param bList {Array<String>}
 * @return list of intersecting elements
 */
export function intersection( aList, bList ) {
  const db = aList.concat(bList).reduce(
    (db,it) => { if (db[it]) { db[it] += 1; } else { db[it] = 1; } return db; },
    {} 
  );
  return Object.entries(db)
  .filter(([k,v]) => v > 1)
  .map(([k,v]) => k);
}

/**
 * Container for components that require authentication to access.
 */
class ProtectedContent extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      authenticated: false,
      redirectTo: null,
    };
  }

  /**
   * Check if the user is logged in, and update state accordingly.
   * @method requireAuth
   * @param {ReduxStore} store
   */
  requireAuth = (store) => {
    const nowMs = Date.now();
    
    if (nowMs - lastAuthMs < 60000) {
      // assume we're still logged in after 1 minute ...
      this.setState( { authenticated: true } );
      return;
    }
    const dispatch = store.dispatch.bind(store);
    return dispatch(fetchUser)
      .then(
        () => {
          const { user } = store.getState();

          if (!user.username) {
            this.setState( { 'redirectTo': '/login' } );
            return Promise.reject('login necessary');
          }

          const newState = {
            authenticated: true,
            redirectTo: null,
          };

          // user is authenticated - now check if he has certs
          const isMissingCerts =
            intersection(requiredCerts, user.certificates_uploaded).length !== requiredCerts.length;
          // take quiz if this user doesn't have required certificate
          if (this.props.location.pathname !== 'quiz' && isMissingCerts) {
            newState.redirectTo = '/quiz';
          } else if (this.props.location.pathname === 'quiz' && !isMissingCerts) {
            newState.redirectTo = '/';
            lastAuthMs = Date.now();
          } else {
            lastAuthMs = Date.now();
          }
          return newState;
        })
        .then( // get a token for the gdcapi from user-api if necessary - ugh
          (newState) => dispatch(fetchProjects())
            .then(() => {
              //
              // The assumption here is that fetchProjects either succeeds or fails.
              // If it fails, then we won't have any project data, and we'll go on
              // to fetchOAuthURL bla bla ..
              //
              const projects = store.getState().submission.projects;
              if (projects) {
                // user already logged in
                return Promise.reject('already logged in');
              }

              return Promise.resolve('');
            })
            .then(() => dispatch(fetchOAuthURL(submissionApiOauthPath)))
            .then(oauthUrl => fetchJsonOrText({ path: oauthUrl, dispatch }))
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
              msg => dispatch(msg),
            )
            .then(
              // refetch the projects - since the earlier call failed with an invalid token ...
              () => dispatch(fetchProjects())
            ).then(
              () => newState,
              () => newState,
            )
        )
        .then((newState) => this.setState(newState));
  };

  componentDidMount() {
    getReduxStore().then(
      store => {
        return Promise.all(
          [
            store.dispatch({ type: 'CLEAR_COUNTS' }), // clear some counters
            store.dispatch({ type: 'CLEAR_QUERY_NODES' }),
            this.requireAuth(store),
          ]
        );
      }
    );
  }

  render() {
    const Component = this.props.component;
    window.scrollTo(0, 0);
    if ( this.state.redirectTo ) {
      return (<Redirect to={this.state.redirectTo} />);
    } else if ( this.state.authenticated ) {
      let params = {};
      let path = '';
      if ( this.props.match ) {
        params = this.props.match.params || {};
        path = this.props.match.path || '';
      }
      console.log('got router params', this.props);
      return (<Component params={params} path={path} location={this.props.location} history={this.props.history} />);  // pass through react-router matcher params ...
    } else {
      return (<Spinner />);
    }
  }
}

export default ProtectedContent;

