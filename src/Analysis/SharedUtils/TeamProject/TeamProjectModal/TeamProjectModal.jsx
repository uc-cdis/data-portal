import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, Spin, Select } from 'antd';
import { useQuery } from 'react-query';
import queryConfig from '../../QueryConfig';
import fetchArboristTeamProjectRoles from '../../teamProjectApi';
import './TeamProjectModal.css';

const TeamProjectModal = ({ isModalOpen, setIsModalOpen, setBannerText }) => {
  const closeAndUpdateTeamProject = () => {
    setIsModalOpen(false);
    setBannerText(selectedTeamProject);
    localStorage.setItem('teamProject', selectedTeamProject);
  };

  const [selectedTeamProject, setSelectedTeamProject] = useState(
    localStorage.getItem('teamProject')
  );

  const { data, status } = useQuery(
    'teamprojects',
    fetchArboristTeamProjectRoles,
    queryConfig
  );

  let modalContent = (
    <React.Fragment>
      <div className='spinner-container'>
        <Spin /> Retrieving the list of team projects.
        <br />
        Please wait...
      </div>
    </React.Fragment>
  );

  if (status === 'error') {
    modalContent = (
      <LoadingErrorMessage
        message={'Error while trying to retrieve user access details'}
      />
    );
  }
  if (data) {
    modalContent = (
      <>
        <div className='team-project-modal_modal-description'>
          Please select your team.
        </div>
        <Select
          id='input-selectTeamProjectDropDown'
          labelInValue
          defaultValue={selectedTeamProject || null}
          onChange={(e) => setSelectedTeamProject(e.value)}
          placeholder='-select one of the team projects below-'
          fieldNames={{ label: 'teamName', value: 'teamName' }}
          options={data.teams}
          dropdownStyle={{ width: '300px' }}
          style={{ width: '300px' }}
        />
      </>
    );
  }
  return (
    <Modal
      className='team-project-modal'
      title='Team Projects'
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      closable={localStorage.getItem('teamProject')}
      maskClosable={false}
      keyboard={false}
      footer={[
        <Button
          key='submit'
          type='primary'
          disabled={!selectedTeamProject}
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
