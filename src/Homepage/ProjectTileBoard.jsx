import React from 'react';
import Relay from 'react-relay'
import {ProjectTile,RelayProjectTile} from './ProjectTile.jsx';
//import LoadingSpinner from "./Spinner/components";


/**
 * List of project details (stack of cards?).  
 * Has projectList property where each entry has the properties
 * for a project detail.
 */
export class ProjectTileBoard extends React.Component {
  render() {
    return <div>
      {
        this.props.projectList.map(
          (proj) => <ProjectTile 
                  key={proj.name}
                  name={proj.name} experimentCount={proj.experimentCount}
                  caseCount={proj.caseCount}
                  />
        )
      }
    </div>;
  }
}


/**
 * Relay route supporting PTBRelayAdapter below -
 * sets up per-project graphql query
 */
class ProjectRoute extends Relay.Route {
  static paramDefinitions = {
    name: {required: true},
  };

  static queries = {
    viewer: () => Relay.QL`
        query {
          viewer
        }
    `
    };

  static routeName = "ProjectRoute"
}


/**
 * Little adapter to kick Relay into running a graphql query
 * per project to get all the data we need ...
 */
export class PTBRelayAdapter extends ProjectTileBoard {
  render() {
    return <div>
      {
        this.props.projectList.map(
          (proj) =>
            <Relay.Renderer key={proj.name} 
                Container={RelayProjectTile}
                queryConfig={new ProjectRoute( { name: proj.name } )}
                environment={Relay.Store}
                render={({done, error, props, retry, stale}) => {
                  if (error) {
                    return <b>Error! {error}</b>;
                  } else if (props && props.viewer ) {
                    return <RelayProjectTile {...props} />;
                  } else {
                    return <b>Loading - put a spinner here!!</b>;
                  }
                }}
                  />
        )
      }
      </div>;
  }
}


