import React from 'react';
import Relay from 'react-relay'
import styled, { css } from 'styled-components';
import {TableBarColor} from '../theme.js'


export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  overflow: auto;
  box-shadow:0 0 6px rgba(0,0,0,0.5);
  margin: 1em 0em;
`;

export const TableHead = styled.thead`
  background: ${TableBarColor};
  color: white;
`;

export const TableRow = styled.tr`
  padding: 0rem 0rem;
  color: #222;
  ${
    props => props.summaryRow ? `
      border-top: 1px solid black;
      background-color: #eeeeee;
      `:"" 
  }
`;


export const TableCell = styled.td`
    color: #222;
    padding: 0.5rem 1rem;
`;

export const TableColLabel = styled.th`
    color: white;
    padding: 0.5rem 1rem;
    height: 100%;
    font-weight: normal;
`;


/**
 * Table row component - fills in columns given project property
 */
export class ProjectTR extends React.Component {
  render() {
    const proj = this.props.project;
    return <TableRow key={proj.name} summaryRow={!! this.props.summaryRow}>
            <TableCell>{proj.name}</TableCell>
            <TableCell>{proj.experimentCount}</TableCell>
            <TableCell>{proj.caseCount}</TableCell>
            <TableCell>{proj.aliquotCount}</TableCell>
            <TableCell>{proj.fileCount}</TableCell>
          </TableRow>;
  }
}


/**
 * Table of projects.  
 * Has projectList property where each entry has the properties
 * for a project detail, and a summaryCounts property with 
 * prefetched totals (property details may be fetched lazily via Relay, whatever ...)
 */
export class ProjectTable extends React.Component {
  /**
   * default row renderer - just delegates to ProjectTR - can be overriden by subtypes, whatever
   */
  rowRender(proj) {
    return <ProjectTR key={proj.name} project={proj} />;
  }

  render() {
    const projectList = (this.props.projectList || []).sort( (a,b) => (a<b) ? -1 : (a === b) ? 0 : 1 );
    const sum = (key) => { projectList.map( (it) => it[key] ).reduce( (acc,it) => { acc+it }, 0 ) };
    const summaryCounts = this.props.summaryCounts || {
      experimentCount: sum( "experimentCount" ),
      caseCount: sum( "caseCount" ),
      aliquotCount: sum( "aliquotCount" ),
      fileCount: sum( "fileCount" )
    };

    return <Table>
      <TableHead>
        <TableRow>
          <TableColLabel>Project</TableColLabel>
          <TableColLabel>Experiments</TableColLabel>
          <TableColLabel>Cases</TableColLabel>
          <TableColLabel>Aliquots</TableColLabel>
          <TableColLabel>Files</TableColLabel>
      </TableRow>
      </TableHead>
      <tbody>
        {
          projectList.map(
            (proj) => this.rowRender(proj)
          )
        }
        <ProjectTR key={summaryCounts} project={{ ...summaryCounts, name: "Totals:" }} summaryRow />
      </tbody>
    </Table>;
  }
}


/**
 * Relay route supporting PTBRelayAdapter below -
 * sets up per-project graphql query
 */
class ProjectRoute extends Relay.Route {
  static paramDefinitions = {
    name: { required: true },
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
 * Relay adapter for project detail
 */
const RelayProjectTR = Relay.createContainer(
  function (dirtyProps) { // graphql to props adapter
    const viewer = dirtyProps.viewer || {
      project: [{
        name: "unknown",
        experimentCount: 0
      }],
      caseCount: 0,
      aliquotCount: 0,
      fileCount: 0
    };
    const proj = { ...viewer.project[0], caseCount: viewer.caseCount, aliquotCount:viewer.aliquotCount, fileCount:0 };

    //console.log( "RelayProjectDetail got details: ", dirtyProps );

    return <ProjectTR project={proj} />;
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
           experimentCount:_experiments_count
         }
         caseCount:_case_count( project_id: $name )
         aliquotCount:_aliquot_count( project_id: $name )
       }`
    }
  }
);


/**
 * Little adapter to kick Relay into running a graphql query
 * per project to get all the data we need ...
 * Drops into the ProjectDashboard - which fetches
 * the original project list.
 */
export class PTableRelayAdapter extends ProjectTable {
  
  /**
   * Overrides rowRender in ProjectTable parent class
   * @param {Object} proj 
   */
  rowRender(proj) {
    return <Relay.Renderer key={proj.name}
      Container={RelayProjectTR}
      queryConfig={new ProjectRoute({ name: proj.name })}
      environment={Relay.Store}
      render={({ done, error, props, retry, stale }) => {
        if (error) {
          return <tr><td><b>Error! {error}</b></td></tr>;
        } else if (props && props.viewer) {
          return <RelayProjectTR {...props} />;
        } else {
          return <tr><td><b>Loading - put a spinner here?</b></td></tr>;
        }
      }}
    />;   
  }

}




