import { useEffect, useMemo, useState } from 'react';
import Table from '../components/tables/base/Table';
import Button from '../gen3-ui-component/components/Button';
import { formatLocalTime } from '../utils';
import './DataRequests.css';

const tableHeader = [
  'ID',
  'Research Title',
  'Submitted Date',
  'Completed Date',
  'Status',
  '',
];

/**
 * @typedef {Object} DataRequestProject
 * @property {number} id
 * @property {string} name
 * @property {'Approved' | 'Rejected' | 'In Review'} status
 * @property {string | null} submitted_at timestamp
 * @property {string | null} completed_at timestamp
 */

/** @returns {Promise<DataRequestProject[]>} */
function fetchProjects() {
  return fetch('/amanuensis/projects').then((res) => res.json());
}

/**
 * @param {DataRequestProject[]} projects
 * @param {boolean} showApprovedOnly
 */
function parseTableData(projects, showApprovedOnly) {
  return projects
    .filter((project) => !showApprovedOnly || project.status === 'Approved')
    .map((project) => [
      project.id,
      project.name,
      formatLocalTime(project.submitted_at),
      formatLocalTime(project.completed_at),
      <span
        className={`data-requests__status-${project.status
          .toLowerCase()
          .replaceAll(' ', '-')}`}
      >
        {project.status}
      </span>,
      <Button
        buttonType='primary'
        enabled={project.status === 'Approved'}
        onClick={() =>
          fetch(`/amanuensis/download-urls/${project.id}`)
            .then((res) => res.json())
            .then((data) =>
              window.open(data.download_url, '_blank', 'noopener, noreferrer')
            )
        }
        label='Download Data'
        rightIcon='download'
      />,
    ]);
}

/** @type {DataRequestProject[]} */
const emptyProjects = [];

export default function DataRequests() {
  const [projects, setProjects] = useState(emptyProjects);
  const [showApprovedOnly, setShowApprovedOnly] = useState(false);
  const tableData = useMemo(
    () => parseTableData(projects, showApprovedOnly),
    [projects, showApprovedOnly]
  );
  useEffect(() => {
    fetchProjects().then(setProjects);
  }, []);

  return (
    <div className='data-requests'>
      <header className='data-requests__header'>
        <h1>Data Requests</h1>
      </header>
      <main>
        <h2>
          List of My Requests
          <Button
            label={showApprovedOnly ? 'Show All' : 'Show Approved Only'}
            onClick={() => setShowApprovedOnly((s) => !s)}
          />
        </h2>
        <Table header={tableHeader} data={tableData} />
      </main>
    </div>
  );
}
