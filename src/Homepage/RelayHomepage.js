import Relay from 'react-relay/classic';
import {ProjectDashboard,RelayProjectDashboard} from './ProjectDashboard.jsx';
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
