import React from 'react';
import Relay from 'react-relay/classic';
import FlatButton from 'material-ui/FlatButton';
import { Link } from 'react-router';
import styled, { css } from 'styled-components';
import {TableBarColor} from '../theme.js';
import CircleButton from '../components/CircleButton.jsx';
import ActionBook from 'material-ui/svg-icons/action/book';
import {GQLHelper} from './gqlHelper.js';
import {getReduxStore} from '../reduxStore.js';
import Translator from "./translate.js";


const tor = Translator.getTranslator();


export const Table = styled.table`
  border-collapse: collapse;
  overflow: auto;
  box-shadow:0 0 6px rgba(0,0,0,0.5);
  margin: 1em 0em;
  text-align:center;
  width:100%;
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
    text-align:center;
`;

class SubmitButton extends React.Component {
  render() {
    return <Link to={this.props.projName} title="Submit Data"><FlatButton backgroundColor="#dddddd" label="Submit Data"/></Link>;
  }
}


/**
 * Table row component - fills in columns given project property
 */
export class ProjectTR extends React.Component {
  render() {
    const proj = this.props.project;
    return <TableRow key={proj.name} summaryRow={!! this.props.summaryRow}>
            <TableCell>
                {proj.name}
            </TableCell>
            <TableCell>{proj.experimentCount}
            </TableCell>
            <TableCell>{proj.caseCount}
            </TableCell>
            <TableCell>{proj.aliquotCount}
            </TableCell>
            <TableCell>
              {proj.fileCount}
            </TableCell>  
            <TableCell>
                   {proj.name !== "Totals:" ? <SubmitButton projName={proj.name} /> : ""}
            </TableCell>
          </TableRow>;
  }
}

/*
<TableCell>
              <svg width="200" height="20" viewBox="0 0 100 100" preserveAspectRatio="none">
                <rect fill="#8888d8" x="0" y="0" width="75" height="100" />
              </svg>
            </TableCell>
            */

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
          <TableColLabel>{tor.translate( "Experiments" )}</TableColLabel>
          <TableColLabel>Cases</TableColLabel>
          <TableColLabel>Aliquots</TableColLabel>
          <TableColLabel>Files</TableColLabel>
          <TableColLabel></TableColLabel>
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


const gqlHelper = GQLHelper.getGQLHelper();

/**
 * Relay adapter for project detail
 */
const RelayProjectTR = Relay.createContainer(
  function (props,context) { // graphql to props adapter
    const viewer = props.viewer || {
      project: [{
        name: "unknown",
        experimentCount: 0
      }],
      caseCount: 0,
      aliquotCount: 0,
      fileCount: 0
    };
    const {fileCount} = GQLHelper.extractFileInfo( viewer );
    const proj = { ...viewer.project[0], caseCount: viewer.caseCount, aliquotCount:viewer.aliquotCount, fileCount:fileCount };

    //console.log( "RelayProjectDetail got details: ", props );

    // Update redux store if data is not already there
    getReduxStore().then(
      (store) => {
        const homeState = store.getState().homepage || {};
        let old = {};
        if ( homeState.projectsByName  ) {
          old = homeState.projectsByName[proj.name] || old;
        }

        if( old.experimentCount !== proj.experimentCount || old.caseCount !== proj.caseCount ||
          old.aliquotCount !== proj.aliquotCount || old.fileCount !== proj.aliquotCount ) {
          store.dispatch( { type: 'RECEIVE_PROJECT_DETAIL', data: proj } );
          } /* else {
          console.log( proj.name + " already in Redux store" );
        } */
      }
    );
    
    return <ProjectTR project={proj} />;
  },
  {
    initialVariables: { // don't forget this hint to the parent query!
      name: null
    },
    fragments: {
      viewer: () => gqlHelper.projectTableTRFragment
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




