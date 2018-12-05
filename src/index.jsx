import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import 'react-select/dist/react-select.css';
import querystring from 'querystring';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faAngleUp, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import ReactGA from 'react-ga';
import { Helmet } from 'react-helmet';

import '@gen3/ui-component/dist/css/base.less';
import { fetchDictionary, fetchSchema, fetchVersionInfo } from './actions';
import ReduxLogin, { fetchLogin } from './Login/ReduxLogin';
import ProtectedContent from './Login/ProtectedContent';
import HomePage from './Homepage/page';
import DocumentPage from './Document/page';
import ExplorerPage from './Explorer/ExplorerPage';
import CoreMetadataPage from './CoreMetadata/page';
import { fetchCoreMetadata } from './CoreMetadata/reduxer';
import IndexPage from './Index/page';
import DataDictionary from './DataDictionary/.';
import ProjectSubmission from './Submission/ReduxProjectSubmission';
import UserProfile, { fetchAccess } from './UserProfile/ReduxUserProfile';
import UserAgreementCert from './UserAgreement/ReduxCertPopup';
import GraphQLQuery from './GraphQLEditor/ReduxGqlEditor';
import theme from './theme';
import getReduxStore from './reduxStore';
import { ReduxNavBar, ReduxTopBar, ReduxFooter } from './Layout/reduxer';
import Footer from './components/layout/Footer';
import ReduxQueryNode, { submitSearchForm } from './QueryNode/ReduxQueryNode';
import { basename, dev, gaDebug } from './localconf';
import ReduxAnalysis from './Analysis/ReduxAnalysis.js';
import { gaTracking, components } from './params';
import GA, { RouteTracker } from './components/GoogleAnalytics';
import DataExplorer from './DataExplorer/.';
import isEnabled from './helpers/featureFlags';
import sessionMonitor from './SessionMonitor';
import Workspace from './Workspace';

// monitor user's session
sessionMonitor.start();

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

// render the app after the store is configured
async function init() {
  const store = await getReduxStore();

  // asyncSetInterval(() => store.dispatch(fetchUser), 60000);
  ReactGA.initialize(gaTracking);
  ReactGA.pageview(window.location.pathname + window.location.search);
  await Promise.all(
    [
      store.dispatch(fetchSchema),
      store.dispatch(fetchDictionary),
      fetchVersionInfo().then(({ status, data }) => {
        if (status === 200) {
          Object.assign(Footer.defaultProps,
            {
              dictionaryVersion: data.dictionary.version || 'unknown',
              apiVersion: data.version || 'unknown',
            },
          );
        }
      }),
    ],
  );
  // FontAwesome icons
  library.add(faAngleUp, faAngleDown);

  render(
    <div>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <MuiThemeProvider>
            <BrowserRouter basename={basename}>
              <div>
                {GA.init(gaTracking, dev, gaDebug) && <RouteTracker />}
                {isEnabled('noIndex') ?
                  <Helmet>
                    <meta name='robots' content='noindex,nofollow' />
                  </Helmet>
                  : null
                }
                <ReduxTopBar />
                <ReduxNavBar />
                <div className='main-content'>
                  <Switch>
                    <Route
                      path='/login'
                      component={
                        (
                          props => (
                            <ProtectedContent
                              public
                              filter={() => store.dispatch(fetchLogin())}
                              component={ReduxLogin}
                              {...props}
                            />
                          )
                        )
                      }
                    />
                    <Route
                      exact
                      path='/'
                      component={
                        props => <ProtectedContent component={IndexPage} {...props} />
                      }
                    />
                    <Route
                      exact
                      path='/submission'
                      component={
                        props => <ProtectedContent component={HomePage} {...props} />
                      }
                    />
                    <Route
                      exact
                      path='/document'
                      component={
                        props => <ProtectedContent component={DocumentPage} {...props} />
                      }
                    />
                    <Route
                      path='/query'
                      component={
                        props => <ProtectedContent component={GraphQLQuery} {...props} />
                      }
                    />
                    <Route
                      path='/analysis'
                      component={
                        props => <ProtectedContent component={ReduxAnalysis} {...props} />
                      }
                    />
                    <Route
                      path='/identity'
                      component={
                        props => (<ProtectedContent
                          filter={() => store.dispatch(fetchAccess())}
                          component={UserProfile}
                          {...props}
                        />)
                      }
                    />
                    <Route
                      path='/quiz'
                      component={
                        props => (<ProtectedContent
                          component={UserAgreementCert}
                          {...props}
                        />)
                      }
                    />
                    <Route
                      path='/dd/:node'
                      component={
                        props => (<ProtectedContent
                          public
                          component={DataDictionary}
                          {...props}
                        />)
                      }
                    />
                    <Route
                      path='/dd'
                      component={
                        props => (<ProtectedContent
                          public
                          component={DataDictionary}
                          {...props}
                        />)
                      }
                    />
                    <Route
                      exact
                      path='/files/*'
                      component={
                        props => (<ProtectedContent
                          filter={() =>
                            store.dispatch(fetchCoreMetadata(props.match.params[0]))
                          }
                          component={CoreMetadataPage}
                          {...props}
                        />)
                      }
                    />
                    <Route
                      path='/files'
                      component={
                        props => <ProtectedContent component={ExplorerPage} {...props} />
                      }
                    />
                    <Route
                      path='/workspace'
                      component={
                        props => <ProtectedContent component={Workspace} {...props} />
                      }
                    />
                    <Route
                      path='/:project/search'
                      component={
                        (props) => {
                          const queryFilter = () => {
                            const location = props.location;
                            const queryParams = querystring.parse(location.search ? location.search.replace(/^\?+/, '') : '');
                            if (Object.keys(queryParams).length > 0) {
                              // Linking directly to a search result,
                              // so kick-off search here (rather than on button click)
                              return store.dispatch(
                                submitSearchForm({
                                  project: props.match.params.project, ...queryParams,
                                }),
                              );
                            }
                            return Promise.resolve('ok');
                          };
                          return (
                            <ProtectedContent
                              filter={queryFilter}
                              component={ReduxQueryNode}
                              {...props}
                            />);
                        }
                      }
                    />
                    {isEnabled('explorer') ?
                      <Route
                        path='/explorer'
                        component={
                          props => <ProtectedContent component={DataExplorer} {...props} />
                        }
                      />
                      : null
                    }
                    <Route
                      path='/:project'
                      component={
                        props => <ProtectedContent component={ProjectSubmission} {...props} />
                      }
                    />
                  </Switch>
                </div>
                <ReduxFooter logos={components.footerLogos} />
              </div>
            </BrowserRouter>
          </MuiThemeProvider>
        </ThemeProvider>
      </Provider>
    </div>,
    document.getElementById('root'),
  );
}

init();
