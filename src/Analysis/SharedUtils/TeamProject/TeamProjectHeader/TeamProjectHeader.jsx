import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'antd';
import './TeamProjectHeader.css';
import EditIcon from './Icons/EditIcon';

const TeamProjectHeader = ({ showButton }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bannerText, setBannerText] = useState('- -');

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const storedTeamProject = localStorage.getItem('teamProject');
    if (storedTeamProject) {
      setBannerText(storedTeamProject);
    }
  }, []);

  return (
    <>
      <h3 className='team-project-header'>
        <strong>Team Project Header</strong>/{bannerText}
        {showButton && (
          <span
            className='team-project-header_modal-button'
            role='button'
            onClick={() => {
              showModal();
              const updatedTeamProject = Math.random();
              setBannerText(updatedTeamProject);
              localStorage.setItem('teamProject', updatedTeamProject);
            }}
          >
            <EditIcon />
          </span>
        )}
      </h3>
      <Modal
        title='Basic Modal'
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Some contents...</p>
      </Modal>
    </>
  );
};

TeamProjectHeader.propTypes = {
  displayType: PropTypes.string,

  showButton: PropTypes.bool,
};

TeamProjectHeader.defaultProps = {
  displayType: 'default',

  showButton: false,
};

export default TeamProjectHeader;
