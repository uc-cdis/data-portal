import Relay from 'react-relay';
import {ProjectDashboard,RelayProjectDashboard} from './ProjectDashboard';
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
