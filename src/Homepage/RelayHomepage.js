import Relay, {Component} from 'react-relay';
import {QueryRenderer, graphql} from 'react-relay';
import environment from '../environment';
import {RelayProjectDashboard} from './ProjectDashboard.jsx';
import { withBoxAndNav, withAuthTimeout } from '../utils';


/**
 * Relay (graphql injected) wrapped homepage
 */
export default Relay.createContainer(
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

const HomepageQuery = graphql`
    query ExplorerPageQuery{
        viewer viewer {
            ${RelayProjectDashboard.getFragment( 'viewer' )}
        }
    }
`;

class RelayHomepage extends Component {
  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={ExplorerPageQuery}
        variables={{
          selected_projects: [],
          selected_file_types: [],
          selected_file_formats: []
        }}
        render={({error, props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            return <RelayProjectDashboard viewer={props.viewer}/>}
          return <div>Loading</div>
        }
        }
      />)
  }
}
