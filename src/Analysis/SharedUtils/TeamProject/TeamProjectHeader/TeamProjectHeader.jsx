import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import EditIcon from './Icons/EditIcon';
import isEnterOrSpace from '../../IsEnterOrSpace';
import TeamProjectModal from '../TeamProjectModal/TeamProjectModal';
import './TeamProjectHeader.css';

const TeamProjectHeader = ({ showButton }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bannerText, setBannerText] = useState('- -');
  const showModal = () => {
    setIsModalOpen(true);
  };

  useEffect(() => {
    const storedTeamProject = localStorage.getItem('teamProject');
    if (storedTeamProject) {
      setBannerText(storedTeamProject);
    }
  }, []);

  return (
    <React.Fragment>
      <h3 className='team-project-header'>
        <strong>Team Project</strong> / {bannerText}
        {showButton && (
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
      </h3>
      {showButton && (
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
  showButton: PropTypes.bool,
};

TeamProjectHeader.defaultProps = {
  showButton: false,
};

export default TeamProjectHeader;
