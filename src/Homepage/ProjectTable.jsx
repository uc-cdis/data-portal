import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import { Link } from 'react-router';
import styled, { css } from 'styled-components';
import { TableBarColor } from '../theme.js';
import CircleButton from '../components/CircleButton.jsx';
import ActionBook from 'material-ui/svg-icons/action/book';
import Translator from './translate.js';


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
  props => (props.summaryRow ? `
      background-color: #eeeeee;
      ` : '')
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
    return <Link to={this.props.projName} title="Submit Data"><FlatButton backgroundColor="#dddddd" label="Submit Data" /></Link>;
  }
}


/**
 * Table row component - fills in columns given project property
 */
export class ProjectTR extends React.Component {
  render() {
    const proj = this.props.project;
    return (<TableRow key={proj.name} summaryRow={!! this.props.summaryRow}>
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
        {proj.name !== 'Totals:' ? <SubmitButton projName={proj.name} /> : ''}
      </TableCell>
    </TableRow>);
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
    const projectList = (this.props.projectList || []).sort((a, b) => ((a.name < b.name) ? -1 : (a.name === b.name) ? 0 : 1));
    const sum = (key) => { projectList.map(it => it[key]).reduce((acc, it) => { acc + it; }, 0); };
    const summaryCounts = this.props.summaryCounts || {
      experimentCount: sum('experimentCount'),
      caseCount: sum('caseCount'),
      aliquotCount: sum('aliquotCount'),
      fileCount: sum('fileCount'),
    };

    return (<Table>
      <TableHead>
        <TableRow>
          <TableColLabel>Project</TableColLabel>
          <TableColLabel>{tor.translate('Experiments')}</TableColLabel>
          <TableColLabel>Cases</TableColLabel>
          <TableColLabel>Aliquots</TableColLabel>
          <TableColLabel>Files</TableColLabel>
          <TableColLabel />
        </TableRow>
      </TableHead>
      <tbody>
        {
          projectList.map(
            proj => this.rowRender(proj),
          )
        }
        <ProjectTR key={summaryCounts} project={{ ...summaryCounts, name: 'Totals:' }} summaryRow />
      </tbody>
    </Table>);
  }
}

