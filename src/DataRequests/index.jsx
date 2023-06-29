import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { contactEmail } from '../localconf';
import ErrorBoundary from '../components/ErrorBoundary';
import Button from '../gen3-ui-component/components/Button';
import DataRequestsTable from './DataRequestsTable';
import './DataRequests.css';

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
 * @property {'Approved' | 'Rejected' | 'In Review' | 'Data Available'} status
 * @property {string | null} submitted_at timestamp
 * @property {string | null} completed_at timestamp
 * @property {ResearcherInfo} researcher
 * @property {boolean} has_access
 */

/** @returns {Promise<DataRequestProject[]>} */
function fetchProjects() {
  return fetch('/amanuensis/projects').then((res) => res.json());
}

/** @type {DataRequestProject[]} */
const emptyProjects = [];

export default function DataRequests() {
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState(emptyProjects);
  function getProjects() {
    setIsLoading(true);
    fetchProjects()
      .then(setProjects)
      .catch(() => setProjects(null))
      .finally(() => setIsLoading(false));
  }
  useEffect(() => {
    getProjects();
  }, []);

  return (
    <div className='data-requests'>
      <header className='data-requests__header'>
        <h1>Data Requests</h1>
      </header>
      <main>
        <ErrorBoundary
          fallback={
            <div className='data-requests__error'>
              <h2>
                <FontAwesomeIcon
                  icon='triangle-exclamation'
                  color='var(--g3-primary-btn__bg-color'
                />{' '}
                Error in fetching your projects...
              </h2>
              <p>
                Please retry or refreshing the page. If the problem persists,
                please contact the administrator (
                <a href={`mailto:${contactEmail}`}>{contactEmail}</a>) for more
                information.
              </p>
              <br />
              <Button
                buttonType='primary'
                label='Retry'
                onClick={getProjects}
                enabled={!isLoading}
              />
            </div>
          }
        >
          <DataRequestsTable
            className='data-requests__table'
            isLoading={isLoading}
            projects={projects}
          />
        </ErrorBoundary>
      </main>
    </div>
  );
}
