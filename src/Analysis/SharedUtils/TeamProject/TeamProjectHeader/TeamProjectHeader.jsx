import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import EditIcon from './Icons/EditIcon';
import isEnterOrSpace from '../../IsEnterOrSpace';
import TeamProjectModal from '../TeamProjectModal/TeamProjectModal';
import './TeamProjectHeader.css';

const TeamProjectHeader = ({ isEditable }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bannerText, setBannerText] = useState('- -');
  const showModal = () => {
    setIsModalOpen(true);
  };
  const history = useHistory();

  useEffect(() => {
    const storedTeamProject = localStorage.getItem('teamProject');
    if (storedTeamProject) {
      setBannerText(storedTeamProject);
    } else if (isEditable) {
      showModal();
    } else if (!isEditable && !storedTeamProject) {
      // non-editable view should redirect to app selection if user doesn't have a storedTeamProject
      history.push('/analysis');
    }
  }, [history, isEditable]);

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
