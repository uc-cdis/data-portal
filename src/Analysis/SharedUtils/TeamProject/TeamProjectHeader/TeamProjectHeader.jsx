import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { useQuery } from 'react-query';
import { BroadcastChannel } from 'broadcast-channel';
import EditIcon from './Icons/EditIcon';
import isEnterOrSpace from '../../AccessibilityUtils/IsEnterOrSpace';
import TeamProjectModal from '../TeamProjectModal/TeamProjectModal';
import queryConfig from '../../QueryConfig';
import fetchArboristTeamProjectRoles from '../Utils/teamProjectApi';
import IsCurrentTeamProjectValid from './IsCurrentTeamProjectValid';
import './TeamProjectHeader.css';

const TeamProjectHeader = ({ isEditable }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bannerText, setBannerText] = useState('- -');
  const [selectedTeamProject, setSelectedTeamProject] = useState(
    localStorage.getItem('teamProject'),
  );
  const showModal = () => {
    setIsModalOpen(true);
  };
  const history = useHistory();

  const rerouteToAppSelectionIfNeeded = () => {
    if (!isEditable && !localStorage.getItem('teamProject')) {
      // non-editable view should redirect to app selection if user doesn't have a storedTeamProject
      history.push('/analysis');
    }
  };

  const channel = new BroadcastChannel('teamProjectChannel');

  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const showWarningModal = () => {
    setIsWarningModalOpen(true);
  };

  useEffect(() => {
    const handleMessage = () => {
      // Only Show Warning Modal for tabs
      // that didn't just submit the team change
      if (!isModalOpen) {
        showWarningModal();
      }
      // Close Open Team Change Modal
      setIsModalOpen(false);
    };

    channel.onmessage = handleMessage;

    // Clean up the channel when the component unmounts
    return () => {
      channel.close();
    };
  }, [channel, showWarningModal]);

  const { data, status } = useQuery(
    'teamprojects',
    fetchArboristTeamProjectRoles,
    queryConfig,
  );

  let currentTeamProjectIsValid = false;
  if (data) {
    currentTeamProjectIsValid = IsCurrentTeamProjectValid(data);
    if (!currentTeamProjectIsValid) {
      localStorage.removeItem('teamProject');
      rerouteToAppSelectionIfNeeded();
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
    rerouteToAppSelectionIfNeeded();
  }, [history, isEditable, currentTeamProjectIsValid, data]);

  return (
    <React.Fragment>
      <div className='team-project-header'>
        <strong>Team Project</strong> / {bannerText}
        {isEditable && (
          <button
            className='team-project-header_modal-button'
            aria-label='Change Team Project'
            type='button'
            tabIndex='0'
            data-testid='team-project-edit'
            onClick={() => {
              showModal();
            }}
            onKeyDown={(e) => {
              if (isEnterOrSpace(e)) showModal();
            }}
          >
            <EditIcon />
          </button>
        )}
      </div>
      {isWarningModalOpen && (
        <TeamProjectModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          setBannerText={setBannerText}
          isWarningModalOpen={isWarningModalOpen}
          setIsWarningModalOpen={setIsWarningModalOpen}
          data={data}
          status={status}
          selectedTeamProject={selectedTeamProject}
          setSelectedTeamProject={setSelectedTeamProject}
        />
      )}
      {isEditable && (
        <TeamProjectModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          setBannerText={setBannerText}
          isWarningModalOpen={isWarningModalOpen}
          setIsWarningModalOpen={setIsWarningModalOpen}
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
