import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Table from '../components/tables/base/Table';
import Button from '../gen3-ui-component/components/Button';
import { useAppSelector } from '../redux/hooks';
import { formatLocalTime } from '../utils';
import DataDownloadButton from './DataDownloadButton';
import './DataRequests.css';
import Spinner from '../gen3-ui-component/components/Spinner/Spinner';

/** @typedef {import('../redux/types').RootState} RootState */
/** @typedef {import('../redux/dataRequest/types').ResearcherInfo} ResearcherInfo */
/** @typedef {import('../redux/dataRequest/types').DataRequestProject} DataRequestProject */

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
 * @param {Object} args
 * @param {DataRequestProject[]} args.projects
 * @param {boolean} args.showApprovedOnly
 * @param {RootState['user']['user_id']} args.userId
 */
function parseTableData({ projects, showApprovedOnly, userId }) {
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
      project.has_access ? <DataDownloadButton project={project} /> : null,
    ]);
}

/**
 * @param {Object} props
 * @param {string} [props.className]
 * @param {DataRequestProject[]} props.projects
 * @param {boolean} props.isAdmin
 * @param {function} props.onToggleAdmin
 * @param {boolean} [props.isLoading]
 */
function DataRequestsTable({ className = '', projects, isAdmin, onToggleAdmin, isLoading }) {
  const transitionTo = useNavigate();
  const userId = useAppSelector((state) => state.user.user_id);
  const [showApprovedOnly, setShowApprovedOnly] = useState(false);
  const tableData = useMemo(
    () => parseTableData({ projects, showApprovedOnly, userId }),
    [projects, showApprovedOnly, userId]
  );
  let [isAdminActive, setAdminActive] = useState(false);

  return (
    <div className={className}>
        <div className='data-requests__table-header'>
          <h2>
            {isAdminActive ? "All Requests" : "List of My Requests"}
          </h2>
          <div className='data-requests__table-actions'>
            {isAdmin && 
              <span className="data-requests__admin-toggle">
                <label htmlFor="data-request-admin-toggle">View Admin</label>
                <input
                  id="data-request-admin-toggle"
                  type='checkbox'
                  checked={isAdminActive}
                  onChange={() => { setAdminActive(!isAdminActive);onToggleAdmin(); }} />
              </span>
            }
            <Button
              label={'Create Request'}
              enabled={isAdmin}
              onClick={() => transitionTo('/requests/create')}
            />
            <Button
              label={showApprovedOnly ? 'Show All' : 'Show Approved Only'}
              onClick={() => setShowApprovedOnly((s) => !s)}
            />
          </div>
        </div>
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
  projects: PropTypes.array.isRequired,
  isAdmin: PropTypes.bool,
  onToggleAdmin: PropTypes.func,
  isLoading: PropTypes.bool
};

export default DataRequestsTable;
