import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import Button from '../../gen3-ui-component/components/Button';
import Table from './base/Table';
import './ProjectTable.less';

/**
 * @typedef {Object} ProjectTableProps
 * @property {{ name: string; counts: number[]; }[]} projectList
 * @property {string[]} summaryFields
 */

/** @param {ProjectTableProps} props */
function ProjectTable({ projectList, summaryFields }) {
  const history = useHistory();
  const tableHeader = ['Project', ...summaryFields, ''];
  const tableData = [...projectList]
    // eslint-disable-next-line no-nested-ternary
    .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
    .map(({ name, counts }, i) => [
      name,
      ...counts,
      <Button
        className='project-table__submit-button'
        key={i}
        onClick={() => history.push(`/${name}`)}
        label='Submit Data'
        buttonType='primary'
        rightIcon='upload'
      />,
    ]);
  return (
    <div className='project-table'>
      <Table title='List of Projects' header={tableHeader} data={tableData} />
    </div>
  );
}

ProjectTable.propTypes = {
  projectList: PropTypes.arrayOf(
    PropTypes.exact({
      name: PropTypes.string.isRequired,
      charts: PropTypes.array,
      code: PropTypes.string,
      counts: PropTypes.arrayOf(PropTypes.number).isRequired,
    })
  ).isRequired,
  summaryFields: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ProjectTable;
