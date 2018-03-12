import React from 'react';
import PropTypes from 'prop-types';
import { countNames, countPluralNames } from '../../localconf';
import { Table, TableHead, TableRow, TableColLabel } from '../style';
import ProjectTR from './ProjectRow';

function compare(a, b) {
  if (a.name < b.name) { return -1; }
  if (a.name > b.name) { return 1; }
  return 0;
}

/**
 * Table of projects.
 * Has projectList property where each entry has the properties
 * for a project detail, and a summaryCounts property with
 * prefetched totals (property details may be fetched lazily via Relay, whatever ...)
 */
class ProjectTable extends React.Component {
  /* eslint class-methods-use-this: ["error", { "exceptMethods": ["rowRender"] }] */
  /**
   * default row renderer - just delegates to ProjectTR - can be overriden by subtypes, whatever
   */
  rowRender(proj) {
    return <ProjectTR key={proj.name} project={proj} />;
  }
  render() {
    const projectList = (this.props.projectList || []).sort(
      (a, b) => compare(a, b),
    );
    const sum = (key) => {
      projectList.map(it => it[key]).reduce((acc, it) => acc + it, 0);
    };
    const summaryCounts = this.props.summaryCounts || {
      count1: sum('countTwo'),
      count2: sum('countOne'),
      count3: sum('countThree'),
      count4: (countNames[3] === 'File') ? sum('fileCount') : sum('countFour'),
    };
    const label1 = countPluralNames[0];
    const label2 = countPluralNames[1];
    const label3 = countPluralNames[2];
    const label4 = countPluralNames[3];

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
          <ProjectTR key={'summaryCounts'} project={{ ...summaryCounts, name: 'Totals:' }} summaryRow />
        </tbody>
      </Table>
    </div>);
  }
}

ProjectTable.propTypes = {
  projectList: PropTypes.array,
  summaryCounts: PropTypes.object,
};

ProjectTable.defaultProps = {
  summaryCounts: {},
  projectList: [],
};

export default ProjectTable;
