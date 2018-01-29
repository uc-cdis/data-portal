import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import { Link } from 'react-router-dom';
import Translator from '../translate';
import { app } from '../../localconf';
import { Table, TableHead, TableRow, TableColLabel, TableCell } from "../style";


const tor = Translator.getTranslator();

class SubmitButton extends React.Component {
  render() {
    return <Link to={this.props.projName} title="Submit Data">
      <FlatButton backgroundColor="#dddddd" label="Submit Data" />
    </Link>;
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
      <TableCell>{(app === 'ndh') ? proj.summaryLabResultCount : proj.aliquotCount}
      </TableCell>
      <TableCell>
        {(app === 'ndh') ? proj.summarySocioDemographicCount : proj.fileCount}
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
      count1: sum('experimentCount'),
      count2: sum('case'),
      count3: (app === 'ndh') ? sum('summaryLabResultCount') : sum('aliquotCount'),
      count4: (app === 'ndh') ? sum('summarySocioDemographicCount') : sum('fileCount'),
    };
    let label3 = (app === 'ndh') ? 'Lab records' : 'Aliquots';
    let label4 = (app === 'ndh') ? 'Socio-demographic records' : 'Files';

    return (<div>
      <h5>List of projects</h5>
      <Table>
        <TableHead>
          <TableRow>
            <TableColLabel>Project</TableColLabel>
            <TableColLabel>{tor.translate('Experiments')}</TableColLabel>
            <TableColLabel>Cases</TableColLabel>
            <TableColLabel>{label3}</TableColLabel>
            <TableColLabel>{label4}</TableColLabel>
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
      </Table>
    </div>);
  }
}

