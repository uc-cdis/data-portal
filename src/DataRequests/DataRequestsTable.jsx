import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Spinner from '../components/Spinner';
import Table from '../components/tables/base/Table';
import Button from '../gen3-ui-component/components/Button';
import { formatLocalTime } from '../utils';
import './DataRequests.css';

/** @typedef {import('../types').UserState} UserState */
/** @typedef {import('./index.jsx').ResearcherInfo} ResearcherInfo */
/** @typedef {import('./index.jsx').DataRequestProject} DataRequestProject */

const tableHeader = [
  'ID',
  'Research Title',
  'Researcher',
  'Submitted Date',
  'Completed Date',
  'Status',
  '',
];

/** @param {ResearcherInfo} researcher */
function parseResearcherInfo(researcher) {
  return researcher ? (
    <span>
      {researcher.first_name} {researcher.last_name}
      <br />({researcher.institution})
    </span>
  ) : (
    ''
  );
}

/**
 * @param {DataRequestProject[]} projects
 * @param {boolean} showApprovedOnly
 * @param {UserState['user_id']} userId
 */
function parseTableData(projects, showApprovedOnly, userId) {
  return projects
    ?.filter((project) => !showApprovedOnly || project.status === 'Approved')
    .map((project) => [
      project.id,
      project.name,
      project.researcher?.id === userId
        ? 'Me'
        : parseResearcherInfo(project.researcher),
      formatLocalTime(project.submitted_at),
      formatLocalTime(project.completed_at),
      <span
        className={`data-requests__status-${project.status
          .toLowerCase()
          .replaceAll(' ', '-')}`}
      >
        {project.status}
      </span>,
      project.has_access ? (
        <Button
          buttonType='primary'
          enabled={project.status === 'Approved' && project.has_access}
          onClick={() =>
            fetch(`/amanuensis/download-urls/${project.id}`)
              .then((res) => res.json())
              .then((data) =>
                window.open(data.download_url, '_blank', 'noopener, noreferrer')
              )
          }
          label='Download Data'
          rightIcon='download'
        />
      ) : null,
    ]);
}

/** @param {{ user: UserState }} state */
function userIdSelector(state) {
  return state.user.user_id;
}

/**
 * @param {Object} props
 * @param {string} [props.className]
 * @param {boolean} props.isLoading
 * @param {DataRequestProject[]} props.projects
 */
function DataRequestsTable({ className = '', isLoading, projects }) {
  const userId = useSelector(userIdSelector);
  const [showApprovedOnly, setShowApprovedOnly] = useState(false);
  const tableData = useMemo(
    () => parseTableData(projects, showApprovedOnly, userId),
    [projects, showApprovedOnly, userId]
  );
  return (
    <div className={className}>
      <h2>
        List of My Requests
        <Button
          label={showApprovedOnly ? 'Show All' : 'Show Approved Only'}
          onClick={() => setShowApprovedOnly((s) => !s)}
        />
      </h2>
      {isLoading ? (
        <Spinner />
      ) : (
        <Table header={tableHeader} data={tableData} />
      )}
    </div>
  );
}

DataRequestsTable.propTypes = {
  className: PropTypes.string,
  isLoading: PropTypes.bool.isRequired,
  projects: PropTypes.array.isRequired,
};

export default DataRequestsTable;
