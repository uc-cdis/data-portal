import { useSearchParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { contactEmail } from '../localconf';
import ErrorBoundary from '../components/ErrorBoundary';
import DataRequestsTable from './DataRequestsTable';
import { toggleAdminActive } from '../redux/dataRequest/slice';
import {
  fetchProjects,
  fetchProjectStates,
} from '../redux/dataRequest/asyncThunks';
import { fetchFilterSets } from '../redux/explorer/asyncThunks';
import './DataRequests.css';
import { isAdminUser } from '../utils';

/** @typedef {import("../redux/dataRequest/types").DataRequestProject} DataRequestProject */

/** @typedef {import("../redux/types").RootState} RootState */

/**
 * @param {RootState} state
 */
function mapPropsToState(state) {
  return {
    projects: state.dataRequest.projects,
    projectStates: state.dataRequest.projectStates,
    savedFilterSets: state.explorer.savedFilterSets,
    isProjectsReloading: state.dataRequest.isProjectsReloading,
    isAdminActive: state.dataRequest.isAdminActive,
  };
}

/**
 * @param {Object} props
 * @param {DataRequestProject[]} [props.projects]
 * @param {RootState["dataRequest"]["projectStates"]} [props.projectStates]
 * @param {RootState["explorer"]["savedFilterSets"]} props.savedFilterSets
 * @param {boolean} [props.isAdminActive]
 * @param {boolean} [props.isProjectsReloading]
 */
function DataRequests({
  projects,
  projectStates,
  savedFilterSets,
  isAdminActive,
  isProjectsReloading,
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const { authz } = useAppSelector((state) => state.user);
  const isAdmin = isAdminUser(authz);

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
                Please refresh the page. If the problem persists, please contact
                the administrator (
                <a href={`mailto:${contactEmail}`}>{contactEmail}</a>) for more
                information.
              </p>
              <br />
            </div>
          }
        >
          <DataRequestsTable
            className='data-requests__table'
            projects={projects}
            projectStates={projectStates}
            savedFilterSets={savedFilterSets}
            onToggleAdmin={(isActive) => {
              dispatch(toggleAdminActive());
              searchParams.delete('admin');
              if (isActive) {
                dispatch(fetchProjectStates());
                dispatch(fetchFilterSets());
                setSearchParams(
                  new URLSearchParams([
                    ...Array.from(searchParams.entries()),
                    ['admin', 'true'],
                  ]),
                );
              } else {
                setSearchParams(searchParams);
              }
              dispatch(fetchProjects({ triggerReloading: true }));
            }}
            reloadProjects={() => {
              dispatch(fetchProjects({ triggerReloading: true }));
            }}
            isAdminActive={isAdminActive}
            isAdmin={isAdmin}
            isLoading={isProjectsReloading}
          />
        </ErrorBoundary>
      </main>
    </div>
  );
}

export default connect(mapPropsToState)(DataRequests);
