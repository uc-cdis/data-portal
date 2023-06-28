import { connect } from 'react-redux';
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { contactEmail } from '../localconf';
import ErrorBoundary from '../components/ErrorBoundary';
import DataRequestsTable from './DataRequestsTable';
import { toggleAdminActive } from '../redux/dataRequest/slice';
import { fetchProjects } from '../redux/dataRequest/asyncThunks';
import './DataRequests.css';

/** @typedef {import('../redux/dataRequest/types').DataRequestProject} DataRequestProject */

function mapPropsToState(state) {
  return { projects: state.dataRequest.projects, isProjectsLoading: state.dataRequest.isProjectsLoading };
}

/**
 * @param {Object} props
 * @param {DataRequestProject[]} [props.projects]
 * @param {boolean} [props.isProjectsLoading]
 */
function DataRequests({ projects, isProjectsLoading }) {
  console.log(projects);
  let dispatch = useAppDispatch();
  let { 
      is_admin,
      authz: { '/services/amanuensis': [{ method: serviceAccessMethod }] }
  } = useAppSelector((state) => state.user);

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
                Please refresh the page. If the problem persists,
                please contact the administrator (
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
            onToggleAdmin={() => {
              dispatch(toggleAdminActive());
              dispatch(fetchProjects());
            }}
            isAdmin={is_admin || !!serviceAccessMethod}
            isLoading={isProjectsLoading}
          />
        </ErrorBoundary>
      </main>
    </div>
  );
}

export default connect(mapPropsToState)(DataRequests);
