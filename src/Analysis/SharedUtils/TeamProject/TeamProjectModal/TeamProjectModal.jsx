import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'antd';

const TeamProjectModal = ({ isModalOpen, setIsModalOpen, setBannerText }) => {
  const closeAndUpdateTeamProject = () => {
    setIsModalOpen(false);
    const updatedTeamProject = `ORD_MVP_${Math.floor(
      1000 + Math.random() * 9000
    )}`;
    setBannerText(updatedTeamProject);
    localStorage.setItem('teamProject', updatedTeamProject);
  };

  return (
    <Modal
      title='Team Projects'
      open={isModalOpen}
      onCancel={() => closeAndUpdateTeamProject()}
      closable={false}
      maskClosable={false}
      footer={[
        <Button
          key='submit'
          type='primary'
          onClick={() => closeAndUpdateTeamProject()}
        >
          Submit
        </Button>,
      ]}
    >
      Click Submit to update team project
    </Modal>
  );
};

TeamProjectModal.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  setIsModalOpen: PropTypes.func.isRequired,
  setBannerText: PropTypes.func.isRequired,
};

export default TeamProjectModal;
