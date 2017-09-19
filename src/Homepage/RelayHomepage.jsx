import React from 'react';
import {QueryRenderer, graphql} from 'react-relay';
import environment from '../environment';
import {ProjectDashboard, DashboardWith} from './ProjectDashboard.jsx';
import {RelayProjectTable} from './RelayProjectTable.jsx';
import { withAuthTimeout, withBoxAndNav} from '../utils';
import { Body, Box, Margin } from '../theme.js';
import Nav from '../Nav/component';
import Footer from '../components/Footer.jsx';
import {GQLHelper} from './gqlHelper.js';
import {getReduxStore} from '../reduxStore.js';


/*
const ExplorerPageQuery = graphql`
    query ExplorerPageQuery{
        viewer {
            ...component_viewer
        }
    }
`;
*/

const gqlHelper = GQLHelper.getGQLHelper();
const DashboardWithRelayTable = DashboardWith( RelayProjectTable );


/**
 * Relay modern query rendered ProjectDashboard.
 * @see https://medium.com/@ven_korolyov/relay-modern-refetch-container-c886296448c7
 * @see https://facebook.github.io/relay/docs/query-renderer.html
 */
class RelayProjectDashboard extends React.Component {

  /**
   * Renderer for relay's QueryRender container
   * @param {Object} param QueryRender args
   */
  renderHelper({error, props}) {
    if (error) {
      return <div>{error.message}</div>
    } else if (props) {
      console.log( "Got props: ", props );
      const {fileCount} = GQLHelper.extractFileInfo( props );
      const projectList = ( props.projectList || [] ).map(
        (proj) => {
          // fill in missing properties
          return Object.assign( { name: "unknown", experimentCount: 0, fileCount: 0, caseCount:0,aliquotCount:0 }, proj );
        }
      );
      //console.log( "Got filecount: " + fileCount );
      const summaryCounts = {
        caseCount: props.caseCount,
        experimentCount: props.experimentCount,
        aliquotCount: props.aliquotCount,
        fileCount: fileCount
      };
      const cleanProps = {
        projectList:projectList, 
        ...summaryCounts
      };

      // Update redux store if data is not already there
      getReduxStore().then(
        (store) => {
          const homeState = store.getState().homepage || {};
          if ( ! homeState.projectsByName  ) {
            store.dispatch( { type: 'RECEIVE_PROJECT_LIST', data: projectList } );      
          } /* else {
            console.log( "project list already in Redux store" );
          } */
        }
      ).catch(
        (err) => {
          console.log( "WARNING: failed to load redux store", err );
        }
      );

      return <DashboardWithRelayTable projectList={projectList} summaryCounts={summaryCounts} />
    }
    return <div>Loading</div>
  }
  
  render() {
    return (
    <QueryRenderer
      environment={environment}
      query={
        gqlHelper.homepageQuery
      }
      variables={{}}
      render={(opts) => { return this.renderHelper(opts); } }
    />);

  }
}


class HelloThere {
  render() { 
    return <h1>Hello, There!</h1>;
  }
} 

const RelayHomepage = withBoxAndNav( withAuthTimeout( RelayProjectDashboard ) );



/**
 * Relay (graphql injected) wrapped homepage
 */
export default RelayHomepage;

/*
Relay.createContainer(
 withBoxAndNav(withAuthTimeout(RelayProjectDashboard)),
 {
   fragments: {
     viewer:() => Relay.QL`
     fragment on viewer {
       ${RelayProjectDashboard.getFragment( 'viewer' )}
     }
     `
   }
 }
);
*/