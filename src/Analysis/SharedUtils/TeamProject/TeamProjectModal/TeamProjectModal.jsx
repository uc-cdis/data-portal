import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, Spin } from 'antd';
import { useQuery } from 'react-query';

import queryConfig from '../../QueryConfig';
import fetchArboristTeamProjectRoles from '../../teamProjectApi';

const TeamProjectModal = ({ isModalOpen, setIsModalOpen, setBannerText }) => {
  const closeAndUpdateTeamProject = () => {
    setIsModalOpen(false);
    const updatedTeamProject = `ORD_MVP_${Math.floor(
      1000 + Math.random() * 9000
    )}`;
    setBannerText(updatedTeamProject);
    localStorage.setItem('teamProject', updatedTeamProject);
  };

  let modalContent = '';
  const { data, status } = useQuery(
    'teamprojects',
    fetchArboristTeamProjectRoles,
    queryConfig
  );
  if (status === 'loading') {
    modalContent = (
      <React.Fragment>
        <div className='spinner-container'>
          <Spin /> Retrieving the list of team projects.
          <br />
          Please wait...
        </div>
      </React.Fragment>
    );
  }
  if (status === 'error') {
    modalContent = (
      <LoadingErrorMessage
        message={'Error while trying to retrieve user access details'}
      />
    );
  }
  modalContent = <h1>{JSON.stringify(data)}</h1>;

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
      {modalContent}
    </Modal>
  );
};

TeamProjectModal.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  setIsModalOpen: PropTypes.func.isRequired,
  setBannerText: PropTypes.func.isRequired,
};

export default TeamProjectModal;
