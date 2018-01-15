import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import { Link } from 'react-router-dom';
import Translator from '../translate';
import { countNames, countPluralNames, localTheme } from '../../localconf';
import { Table, TableHead, TableRow, TableColLabel, TableCell } from '../style';


const tor = Translator.getTranslator();

class SubmitButton extends React.Component {
  render() {
    return (<Link to={this.props.projName} title="Submit or View Graph">
      <FlatButton backgroundColor={localTheme['projectTable.submitButtonColor']} label="Submit or View Graph" />
    </Link>);
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
      <TableCell>{proj.countOne}
      </TableCell>
      <TableCell>{proj.countTwo}
      </TableCell>
      <TableCell>{proj.countThree}
      </TableCell>
      <TableCell>
        {(countNames[2] === 'File') ? proj.fileCount : proj.countThree}
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
      count1: sum('countTwo'),
      count2: sum('countOne'),
      count3: sum('countThree'),
      count4: (countNames[2] === 'File') ? sum('fileCount') : sum('countThree'),
    };
    const label1 = countPluralNames[0];
    const label2 = countPluralNames[1];
    const label3 = countPluralNames[3];
    const label4 = countPluralNames[2];

    return (<div>
      <h5>List of Projects</h5>
      <Table>
        <TableHead>
          <TableRow>
            <TableColLabel>Project</TableColLabel>
            <TableColLabel>{label1}</TableColLabel>
            <TableColLabel>{label2}</TableColLabel>
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

