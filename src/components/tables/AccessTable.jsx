import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Table from './base/Table';

const LIST_PROJECT_MSG = 'You have access to the following project(s)';
const PROJECT_COLUMN = 'Project(s)';
const RIGHT_COLUMN = 'Right(s)';

export const ProjectCell = styled(Link)`
  display: inline-block;
  width: 30%;
  padding-left: 0.5em;
`;

export const ProjectCellNoAccess = styled.div`
  display: inline-block;
  width: 30%;
  padding-left: 0.5em;
`;

class AccessTable extends React.Component {
  /* eslint class-methods-use-this: ["error", { "exceptMethods": ["rowRender"] }] */
  /**
   * default row renderer - just delegates to ProjectTR - can be overriden by subtypes, whatever
   */

  getData = (projectKeys, projectsAccesses, projects) => projectKeys.map(p => [
    p in projects ?
      <ProjectCell to={`/${projects[p]}`}>
        {p}
      </ProjectCell> :
      <ProjectCellNoAccess>
        {p}
      </ProjectCellNoAccess>,
    projectsAccesses[p].join(', '),
  ]);

  render() {
    const projectKeys = Object.keys(this.props.projectsAccesses);
    return (<Table
      title={LIST_PROJECT_MSG}
      header={[PROJECT_COLUMN, RIGHT_COLUMN]}
      data={this.getData(projectKeys, this.props.projectsAccesses, this.props.projects)}
    />);
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
