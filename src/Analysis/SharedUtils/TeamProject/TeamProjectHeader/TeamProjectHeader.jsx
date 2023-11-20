import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { useQuery } from 'react-query';
import EditIcon from './Icons/EditIcon';
import isEnterOrSpace from '../../IsEnterOrSpace';
import TeamProjectModal from '../TeamProjectModal/TeamProjectModal';
import queryConfig from '../../QueryConfig';
import fetchArboristTeamProjectRoles from '../Utils/teamProjectApi';
import IsCurrentTeamProjectValid from './IsCurrentTeamProjectValid';
import './TeamProjectHeader.css';

const TeamProjectHeader = ({ isEditable }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bannerText, setBannerText] = useState('- -');
  const [selectedTeamProject, setSelectedTeamProject] = useState(
    localStorage.getItem('teamProject')
  );
  const showModal = () => {
    setIsModalOpen(true);
  };
  const history = useHistory();

  const rerouteToAppSelection = () => {
    if (!isEditable && !localStorage.getItem('teamProject')) {
      // non-editable view should redirect to app selection if user doesn't have a storedTeamProject
      history.push('/analysis');
    }
  };

  const { data, status } = useQuery(
    'teamprojects',
    fetchArboristTeamProjectRoles,
    queryConfig
  );

  let currentTeamProjectIsValid = false;
  if (data) {
    console.log('data', data);
    currentTeamProjectIsValid = IsCurrentTeamProjectValid(data);
    if (!currentTeamProjectIsValid) {
      console.log('REROUTING!');
      localStorage.removeItem('teamProject');
      rerouteToAppSelection();
    }
  }

  useEffect(() => {
    const storedTeamProject = localStorage.getItem('teamProject');
    if (storedTeamProject) {
      setBannerText(storedTeamProject);
    } else if (isEditable) {
      setSelectedTeamProject(null);
      showModal();
    }
    rerouteToAppSelection();
  }, [history, isEditable, currentTeamProjectIsValid, data]);

  return (
    <React.Fragment>
      <div className='team-project-header'>
        <strong>Team Project</strong> / {bannerText}
        {isEditable && (
          <span
            className='team-project-header_modal-button'
            tabIndex='0'
            role='button'
            data-testid='team-project-edit'
            onClick={() => {
              showModal();
            }}
            onKeyDown={(e) => {
              if (isEnterOrSpace(e)) showModal();
            }}
          >
            <EditIcon />
          </span>
        )}
      </div>
      {isEditable && (
        <TeamProjectModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          setBannerText={setBannerText}
          data={data}
          status={status}
          selectedTeamProject={selectedTeamProject}
          setSelectedTeamProject={setSelectedTeamProject}
        />
      )}
    </React.Fragment>
  );
};

TeamProjectHeader.propTypes = {
  isEditable: PropTypes.bool,
};

TeamProjectHeader.defaultProps = {
  isEditable: false,
};

export default TeamProjectHeader;
