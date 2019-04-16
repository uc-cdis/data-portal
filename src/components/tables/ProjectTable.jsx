import React from 'react';
import PropTypes from 'prop-types';
import Button from '@gen3/ui-component/dist/components/Button';
import Table from './base/Table';

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

  getData = projectList => projectList.map((proj, i) => [
    proj.name,
    ...proj.counts,
    <Button
      key={i}
      onClick={() => this.props.history.push(`/${proj.name}`)}
      label='Submit Data'
      buttonType='primary'
      rightIcon='upload'
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
    return (
      <div className='project-table'>
        <Table
          title='List of Projects'
          header={this.getHeaders(this.props.summaries)}
          data={this.getData(projectList)}
        />
      </div>
    );
  }
}

ProjectTable.propTypes = {
  projectList: PropTypes.array,
  summaries: PropTypes.array,
  history: PropTypes.object.isRequired,
};

ProjectTable.defaultProps = {
  summaries: [],
  projectList: [],
};

export default ProjectTable;
