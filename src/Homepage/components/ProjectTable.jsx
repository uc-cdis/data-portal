import React from 'react';
import PropTypes from 'prop-types';
import { Table, TableHead, TableRow, TableColLabel } from '../style';
import ProjectTR from './ProjectRow';
import dictIcons from "../../img/icons/index";

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
  rowRender(proj, i) {
    return <ProjectTR key={proj.name} project={proj} index={i} dictIcons={dictIcons}/>;
  }
  render() {
    const projectList = (this.props.projectList || []).sort(
      (a, b) => compare(a, b),
    );
    const summaries = this.props.summaries;

    return (<div>
      <h2>List of Projects</h2>
      <Table>
        <TableHead>
          <tr>
            <TableColLabel>Project</TableColLabel>
            {
              summaries.map(
                entry => <TableColLabel key={entry.label}>{entry.label}</TableColLabel>,
              )
            }
            <TableColLabel />
          </tr>
        </TableHead>
        <tbody>
          {
            projectList.map(
              (proj, i) => this.rowRender(proj, i),
            )
          }
          <ProjectTR
            key={'summaryCounts'}
            project={{
              counts: summaries.map(entry => entry.value),
              name: 'Totals:' }}
            summaryRow
            index={projectList.length}
          />
        </tbody>
      </Table>
    </div>);
  }
}

ProjectTable.propTypes = {
  projectList: PropTypes.array,
  summaries: PropTypes.array,
};

ProjectTable.defaultProps = {
  summaries: [],
  projectList: [],
};

export default ProjectTable;
