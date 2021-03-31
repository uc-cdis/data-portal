import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Table from './base/Table';
import './AccessTable.less';
import { projectCodeFromResourcePath, listifyMethodsFromMapping } from '../../authMappingUtils';

const LIST_PROJECT_MSG = 'You have access to the following project(s)';
const LIST_RESOURCE_MSG = 'You have access to the following resource(s)';
const PROJECT_COLUMN = 'Project(s)';
const RESOURCE_COLUMN = 'Resource(s)';
const METHOD_COLUMN = 'Method(s)';

class AccessTable extends React.Component {
  /* eslint class-methods-use-this: ["error", { "exceptMethods": ["rowRender"] }] */
  /**
   * default row renderer - just delegates to ProjectTR - can be overriden by subtypes, whatever
   */

  getDataFenceProjectAccess = (projectsAccesses, projects) => Object.keys(projectsAccesses)
    .map((p) => [
      p in projects
        ? (
          <Link to={`/${projects[p]}`}>
            {p}
          </Link>
        )
        : (
          <div>
            {p}
          </div>
        ),
      projectsAccesses[p].join(', '),
    ]);

  getDataArboristAuthMapping = (userAuthMapping, projects) => Object.keys(userAuthMapping)
    .map((r) => {
      const projCode = projectCodeFromResourcePath(r); // will be project code or ''
      return [
        projCode in projects
          ? (
            <Link to={`/${projects[projCode]}`}>
              {r}
            </Link>
          )
          : (
            <div>
              {r}
            </div>
          ),
        listifyMethodsFromMapping(userAuthMapping[r]).join(', '),
      ];
    });

  render() {
    if (this.props.userAuthMapping === undefined) {
      return (
        <div className='access-table'>
          <Table
            title={LIST_PROJECT_MSG}
            header={[PROJECT_COLUMN, METHOD_COLUMN]}
            data={this.getDataFenceProjectAccess(this.props.projectsAccesses, this.props.projects)}
          />
        </div>
      );
    }
    return (
      <div className='access-table'>
        <Table
          title={LIST_RESOURCE_MSG}
          header={[RESOURCE_COLUMN, METHOD_COLUMN]}
          data={this.getDataArboristAuthMapping(this.props.userAuthMapping, this.props.projects)}
        />
      </div>
    );
  }
}

AccessTable.propTypes = {
  projects: PropTypes.object,
  projectsAccesses: PropTypes.object,
  userAuthMapping: PropTypes.object,
};

AccessTable.defaultProps = {
  projects: {},
  projectsAccesses: {},
  userAuthMapping: undefined,
};

export default AccessTable;
