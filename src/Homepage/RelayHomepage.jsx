import React from 'react';
import { connect } from 'react-redux';
import { QueryRenderer, graphql } from 'react-relay';
import environment from '../environment';
import { ProjectDashboard, DashboardWith } from './ProjectDashboard';
import { RelayProjectTable } from './RelayProjectTable';
import { withAuthTimeout, withBoxAndNav } from '../utils';
import { GQLHelper } from '../gqlHelper';
import { getReduxStore } from '../reduxStore';
import Spinner from '../components/Spinner';


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
export class RelayProjectDashboard extends React.Component {
  /**
   * Update Redux with the project data from Relay if necessary.
   * The ReduxProjectBarChart renders a graph with project-details
   * as data flows into redux from Relay (RelayProjectTable supplements
   * redux with per-project details).
   * 
   * @param {Array<Proj>} projectList 
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
        console.log('WARNING: failed to load redux store', err);
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
        Object.assign({ name: 'unknown', experimentCount: 0, fileCount: 0, caseCount: 0, aliquotCount: 0 }, proj),

    );
    // console.log( "Got filecount: " + fileCount );
    const summaryCounts = {
      caseCount: relayProps.caseCount,
      experimentCount: relayProps.experimentCount,
      aliquotCount: relayProps.aliquotCount,
      fileCount,
    };
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


const RelayHomepage = withBoxAndNav(withAuthTimeout(RelayProjectDashboard));


/**
 * Relay (graphql injected) wrapped homepage
 */
export default RelayHomepage;

