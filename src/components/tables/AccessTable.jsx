import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Table from './base/Table';
import './AccessTable.less';

const LIST_PROJECT_MSG = 'You have access to the following project(s)';
const PROJECT_COLUMN = 'Project(s)';
const RIGHT_COLUMN = 'Right(s)';

class AccessTable extends React.Component {
  /* eslint class-methods-use-this: ["error", { "exceptMethods": ["rowRender"] }] */
  /**
   * default row renderer - just delegates to ProjectTR - can be overriden by subtypes, whatever
   */

  getData = (projectKeys, projectsAccesses, projects) => projectKeys.map(p => [
    p in projects ?
      <Link className='access-table__project-cell' to={`/${projects[p]}`}>
        {p}
      </Link> :
      <div className='access-table__project-cell'>
        {p}
      </div>,
    projectsAccesses[p].join(', '),
  ]);

  render() {
    const projectKeys = Object.keys(this.props.projectsAccesses);
    return (
      <div className='access-table'>
        <Table
          title={LIST_PROJECT_MSG}
          header={[PROJECT_COLUMN, RIGHT_COLUMN]}
          data={this.getData(projectKeys, this.props.projectsAccesses, this.props.projects)}
        />
      </div>
    );
  }
}

AccessTable.propTypes = {
  projects: PropTypes.object,
  projectsAccesses: PropTypes.object,

};

AccessTable.defaultProps = {
  projects: {},
  projectsAccesses: {},
};

export default AccessTable;
