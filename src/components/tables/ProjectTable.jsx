import React from 'react';
import PropTypes from 'prop-types';
import Table from './base/Table';
import IconicLink from '../buttons/IconicLink';
import dictIcons from '../../img/icons/index';

function compare(a, b) {
  if (a.name < b.name) { return -1; }
  if (a.name > b.name) { return 1; }
  return 0;
}

class ProjectTable extends React.Component {
  /* eslint class-methods-use-this: ["error", { "exceptMethods": ["rowRender"] }] */
  /**
   * default row renderer - just delegates to ProjectTR - can be overriden by subtypes, whatever
   */

  getHeaders = (summaries) => {
    const summaryFields = summaries.map(entry => entry.label);
    return ['Project', ...summaryFields, ''];
  };

  getData = projectList => projectList.map(proj => [
    proj.name,
    ...proj.counts,
    <IconicLink
      key={proj.name}
      link={`/${proj.name}`}
      dictIcons={dictIcons}
      icon='upload'
      caption='Submit Data'
      buttonClassName='button-primary-orange'
    />,
  ]);

  getFooter = (summaries) => {
    const totalCounts = summaries.map(entry => entry.value);
    return ['Totals', ...totalCounts, ''];
  };

  render() {
    const projectList = (this.props.projectList || []).sort(
      (a, b) => compare(a, b),
    );
    return (<Table
      header={this.getHeaders(this.props.summaries)}
      data={this.getData(projectList)}
      footer={this.getFooter(this.props.summaries)}
    />);
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
