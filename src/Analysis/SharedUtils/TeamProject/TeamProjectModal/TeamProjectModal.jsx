import React, { useEffect } from 'react';
import { Button, Modal } from 'antd';

const TeamProjectModal = ({ isModalOpen, setIsModalOpen, setBannerText }) => {
  const closeAndUpdateTeamProject = () => {
    const updatedTeamProject =
      'ORD_MVP_' + Math.floor(1000 + Math.random() * 9000);
    setBannerText(updatedTeamProject);
    localStorage.setItem('teamProject', updatedTeamProject);
    setIsModalOpen(false);
  };

  return (
    <Modal
      title='Basic Modal'
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
      <p>Click Submit to update team project</p>
    </Modal>
  );
};
export default TeamProjectModal;
