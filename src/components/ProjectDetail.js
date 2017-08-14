import React from 'react';
import Relay from 'react-relay'
import styled from 'styled-components';
import { Link } from 'react-router';
import { CustomPieChart, StackedBarChart } from './Visualizations.js';





/**
 * Little ProjectDetail block to drop onto the project dashboard with properties:
 *       name, description, experimentCount, caseCount
 */
export class ProjectDetail extends React.Component {
  
  render () {
    const projectList = [ 
      { name: this.props.name, experimentCount: this.props.experimentCount, caseCount:this.props.caseCount }
    ];

    return (
      <div>
        <h3>
          <Link to={this.props.name}>{this.props.name}</Link>
          <p>
            ECount: {this.props.experimentCount}
          </p>
        </h3>
        <StackedBarChart projectList={projectList} />
      </div>
    );
  }
}


/**
 * Relay adapter for project detail
 */
export const RelayProjectDetail = Relay.createContainer(
  function( dirtyProps ) { // graphql to props adapter
    const viewer = dirtyProps.viewer || {
      project: [{
        name: "unknown",
        experimentCount: 0
      }],
      caseCount: 0
    };
    console.log( "RelayProjectDetail got details: ", dirtyProps );
    
    const props = { ...viewer.project[0], caseCount:viewer.caseCount };
    return <ProjectDetail { ...props} />;
  },
  {
    initialVariables: { // don't forget this hint to the parent query!
      name: null
    },
    fragments: {
      viewer: () => Relay.QL`
        fragment on viewer {
          project(project_id: $name) {
            name:project_id
          }
          caseCount:_case_count( project_id: $name )
        }`
    }
  }
);



/**
 * List of project details (stack of cards?).  
 * Has projectList property where each entry has the properties
 * for a project detail.
 */
export class ProjectDetailList extends React.Component {
  render() {
    return <div>
      {
        this.props.projectList.map(
          (proj) => <ProjectDetail 
                  key={proj.name}
                  name={proj.name} experimentCount={proj.experimentCount}
                  caseCount={proj.caseCount}
                  />
        )
      }
    </div>

  }
}


class ProjectDetailRoute extends Relay.Route {
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

  static routeName = "ProjectDetailRoute"
}


export class PDListAdapter extends ProjectDetailList {
  render() {
    return <div>
      {
        this.props.projectList.map(
          (proj) =>
            <Relay.Renderer key={proj.name} 
                Container={RelayProjectDetail}
                queryConfig={new ProjectDetailRoute( { name: proj.name } )}
                environment={Relay.Store}
                render={({done, error, props, retry, stale}) => {
                  if (error) {
                    return <b>Error! {error}</b>;
                  } else if (props && props.viewer ) {
                    return <RelayProjectDetail {...props} />;
                  } else {
                    return <b>Loading!</b>;
                  }
                }}
                  />
        )
      }
      </div>;
  }
}


