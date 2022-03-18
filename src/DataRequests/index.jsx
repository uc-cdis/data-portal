import { useEffect, useState } from 'react';
import Table from '../components/tables/base/Table';
import Button from '../gen3-ui-component/components/Button';
import { capitalizeFirstLetter, formatLocalTime } from '../utils';
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
 * @property {'APPROVED' | 'REJECTED' | 'IN REVIEW'} status
 * @property {string | null} submitted_at timestamp
 * @property {string | null} completed_at timestamp
 */

/** @returns {Promise<DataRequestProject[]>} */
function fetchProjects() {
  return fetch('/amanuensis/projects').then((res) => res.json());
}

function parseTableData(/** @type {DataRequestProject[]} */ projects) {
  return projects.map((project) => [
    project.id,
    project.name,
    formatLocalTime(project.submitted_at),
    formatLocalTime(project.completed_at),
    <span
      className={`data-requests__status-${project.status
        .toLowerCase()
        .replaceAll(' ', '-')}`}
    >
      {capitalizeFirstLetter(project.status)}
    </span>,
    <Button
      buttonType='primary'
      enabled={project.status === 'APPROVED'}
      onClick={() =>
        fetch(`amanuensis/downlod-links/${project.id}`)
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

/** @type {(string | number | JSX.Element)[][]} */
const emptyTableData = [];
export default function DataRequests() {
  const [tableData, setTableData] = useState(emptyTableData);
  useEffect(() => {
    fetchProjects().then((data) => setTableData(parseTableData(data)));
  }, []);

  return (
    <div className='data-requests'>
      <header className='data-requests__header'>
        <h1>Data Requests</h1>
      </header>
      <main>
        <Table
          title='List of My Requests'
          header={tableHeader}
          data={tableData}
        />
      </main>
    </div>
  );
}
