import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, Modal, Spin, Select,
} from 'antd';
import LoadingErrorMessage from '../../LoadingErrorMessage/LoadingErrorMessage';
import './TeamProjectModal.css';

const TeamProjectModal = ({
  isModalOpen,
  setIsModalOpen,
  setBannerText,
  data,
  status,
  selectedTeamProject,
  setSelectedTeamProject,
}) => {
  const closeAndUpdateTeamProject = () => {
    setIsModalOpen(false);
    setBannerText(selectedTeamProject);
    localStorage.setItem('teamProject', selectedTeamProject);
  };

  let modalContent = (
    <Modal
      open={isModalOpen}
      className='team-project-modal'
      title='Team Projects'
      closable={false}
      maskClosable={false}
      keyboard={false}
      footer={false}
    >
      <div className='spinner-container'>
        <Spin /> Retrieving the list of team projects.
        <br />
        Please wait...
      </div>
    </Modal>
  );

  if (status === 'error') {
    modalContent = (
      <Modal
        open={isModalOpen}
        className='team-project-modal'
        title='Team Projects'
        closable={false}
        maskClosable={false}
        keyboard={false}
        footer={false}
      >
        <LoadingErrorMessage
          message={'Error while trying to retrieve user access details'}
        />
      </Modal>
    );
  }
  if (data) {
    modalContent = (
      <Modal
        className='team-project-modal'
        title='Team Projects'
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        closable={localStorage.getItem('teamProject')}
        maskClosable={localStorage.getItem('teamProject')}
        keyboard={localStorage.getItem('teamProject')}
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
        <div className='team-project-modal_modal-description'>
          Please select your team.
        </div>
        <Select
          id='input-selectTeamProjectDropDown'
          labelInValue
          defaultValue={selectedTeamProject}
          onChange={(e) => setSelectedTeamProject(e.value)}
          placeholder='-select one of the team projects below-'
          fieldNames={{ label: 'teamName', value: 'teamName' }}
          options={data.teams}
          dropdownStyle={{ width: '100%' }}
        />
      </Modal>
    );
  }
  return <React.Fragment>{modalContent}</React.Fragment>;
};

TeamProjectModal.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  setIsModalOpen: PropTypes.func.isRequired,
  setBannerText: PropTypes.func.isRequired,
  data: PropTypes.object,
  status: PropTypes.string.isRequired,
  selectedTeamProject: PropTypes.string,
  setSelectedTeamProject: PropTypes.func.isRequired,
};
TeamProjectModal.defaultProps = {
  data: PropTypes.null,
  selectedTeamProject: PropTypes.null,
};
export default TeamProjectModal;
