import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Spinner from '../components/Spinner';
import Table from '../components/tables/base/Table';
import Button from '../gen3-ui-component/components/Button';
import { formatLocalTime } from '../utils';
import './DataRequests.css';

const tableHeader = [
  'ID',
  'Research Title',
  'Researcher',
  'Submitted Date',
  'Completed Date',
  'Status',
  '',
];

/** @typedef {import('../types').UserState} UserState */

/**
 * @typedef {Object} ResearcherInfo
 * @property {number} id
 * @property {string} first_name
 * @property {string} last_name
 * @property {string} institution
 */

/**
 * @typedef {Object} DataRequestProject
 * @property {number} id
 * @property {string} name
 * @property {'Approved' | 'Rejected' | 'In Review'} status
 * @property {string | null} submitted_at timestamp
 * @property {string | null} completed_at timestamp
 * @property {ResearcherInfo} researcher
 * @property {boolean} has_access
 */

/** @returns {Promise<DataRequestProject[]>} */
function fetchProjects() {
  return fetch('/amanuensis/projects').then((res) => res.json());
}

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

/** @type {DataRequestProject[]} */
const emptyProjects = [];

export default function DataRequests() {
  const userId = useSelector(
    (/** @type {{ user: UserState }} */ state) => state.user.user_id
  );

  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState(emptyProjects);
  const [showApprovedOnly, setShowApprovedOnly] = useState(false);
  const tableData = useMemo(
    () => parseTableData(projects, showApprovedOnly, userId),
    [projects, showApprovedOnly, userId]
  );
  useEffect(() => {
    setIsLoading(true);
    fetchProjects()
      .then(setProjects)
      .catch(() => setProjects(null))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className='data-requests'>
      <header className='data-requests__header'>
        <h1>Data Requests</h1>
      </header>
      <main>
        {Array.isArray(tableData) ? (
          <div className='data-requests__table'>
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
        ) : (
          <div className='data-requests__error'>
            <h2>
              <FontAwesomeIcon
                icon='exclamation-triangle'
                color='var(--g3-primary-btn__bg-color'
              />{' '}
              Error in fetching your projects...
            </h2>
            <p>
              Please retry or refreshing the page. If the problem persists,
              please contact administrator for more information.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
