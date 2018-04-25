import React from 'react';
import { QueryRenderer } from 'react-relay';
import { fetchQuery } from 'relay-runtime';
import environment from '../../environment';
import { DashboardWith } from '../components/ParamProjectDashboard';
import RelayProjectTable from './RelayProjectTable';
import { GQLHelper } from '../../gqlHelper';
import getReduxStore from '../../reduxStore';
import Spinner from '../../components/Spinner';


const gqlHelper = GQLHelper.getGQLHelper();
const DashboardWithRelayTable = DashboardWith(RelayProjectTable);


/**
 * Relay modern QueryRenderer rendered ProjectDashboard.
 * Note - this is exported to support testing - it's really an module-private class
 * that corrdinates data-collection on the homepage.
 *
 * @see https://medium.com/@ven_korolyov/relay-modern-refetch-container-c886296448c7
 * @see https://facebook.github.io/relay/docs/query-renderer.html
 */
class RelayProjectDashboard extends React.Component {
  /**
   * Update Redux with the project data from Relay if necessary.
   * The ReduxProjectBarChart renders a graph with project-details
   * as data flows into redux from Relay (RelayProjectTable supplements
   * redux with per-project details).
   *
   * @param {Array<proj>} projectList
   * @param {Array<counts>} summaryCounts
   */
  static async updateRedux({ projectList, summaryCounts }) {
    // Update redux store if data is not already there
    return getReduxStore().then(
      (store) => {
        const homeState = store.getState().homepage || {};
        if (!homeState.projectsByName) {
          store.dispatch({ type: 'RECEIVE_PROJECT_LIST', data: { projectList, summaryCounts } });
          return 'dispatch';
        }
        return 'NOOP';
      },
      (err) => {
        /* eslint no-console: ["error", { allow: ["error"] }] */
        console.error('WARNING: failed to load redux store', err);
        return 'ERR';
      },
    );
  }

  /**
   * Translate relay properties to {summaryCounts, projectList} structure
   * that is friendly to underlying components.
   *
   * @param relayProps
   * @return {projectList, summaryCounts}
   */
  static transformRelayProps(relayProps) {
    const { fileCount } = GQLHelper.extractFileInfo(relayProps);
    const projectList = (relayProps.projectList || []).map(
      proj =>
        // fill in missing properties
        Object.assign({ name: 'unknown',
          counts: [0, 0, 0, 0],
          charts: [0, 0],
        }, proj),

    );
    // console.log( "Got filecount: " + fileCount );
    let summaryCounts = Object.keys(relayProps).filter(
      key => key.indexOf('count') === 0).map(key => key).sort()
      .map(key => relayProps[key],
      );
    if (summaryCounts.length < 4) {
      summaryCounts = [...summaryCounts, fileCount];
    }
    return {
      projectList,
      summaryCounts,
    };
  }

  /**
   * Renderer for relay's QueryRender container
   * @param {Object} param QueryRender args
   */
  static renderHelper({ error, props }) {
    if (error) {
      return <div>{error.message}</div>;
    } else if (props) {
      // console.log( "Got props: ", props );
      const { projectList, summaryCounts } = RelayProjectDashboard.transformRelayProps(props);
      RelayProjectDashboard.updateRedux({ projectList, summaryCounts });

      return <DashboardWithRelayTable projectList={projectList} summaryCounts={summaryCounts} />;
    }
    return <Spinner />;
  }

  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={
          gqlHelper.homepageQuery
        }
        variables={{}}
        render={opts => RelayProjectDashboard.renderHelper(opts)}
      />);
  }
}


const getProjectsList = () => {
  fetchQuery(environment, gqlHelper.homepageQuery, {})
    .then(
      data => {
        const { projectList, summaryCounts } = transformRelayProps(data);
        updateRedux({ projectList, summaryCounts });
        getProjectDetail(projectList);
      },
      error => {
        updateReduxError(error);
      }
    )
};

/**
 * Relay (graphql injected) wrapped homepage
 */
export default RelayProjectDashboard;

