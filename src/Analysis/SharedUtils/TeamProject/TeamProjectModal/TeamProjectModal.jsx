import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { Button, Modal, Spin } from 'antd';
import { BroadcastChannel } from 'broadcast-channel';
import LoadingErrorMessage from '../../LoadingErrorMessage/LoadingErrorMessage';
import TeamsDropdown from './TeamsDropdown/TeamsDropdown';
import './TeamProjectModal.css';


const TeamProjectModal = ({
  isModalOpen,
  setIsModalOpen,
  isWarningModalOpen,
  setIsWarningModalOpen,
  setBannerText,
  data,
  status,
  selectedTeamProject,
  setSelectedTeamProject,
}) => {
  const history = useHistory();

  const channel = new BroadcastChannel('teamProjectChannel');
  const sendMessage = (msg) => {
    channel.postMessage(msg);
  };

  const closeAndUpdateTeamProject = () => {
    setIsModalOpen(false);
    sendMessage('Team Project Changed!');
    setBannerText(selectedTeamProject);
    localStorage.setItem('teamProject', selectedTeamProject);
  };

  const closeWarningAndRefreshPage = () => {
    setIsWarningModalOpen(false);
    window.location.reload();
  };

  const redirectToHomepage = () => {
    history.push('/');
  };

  if (status === 'error') {
    return (
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
  if (isWarningModalOpen === true) {
    return (
      <Modal
        open={isWarningModalOpen}
        className='team-project-modal'
        title='Team Projects'
        closable
        maskClosable={false}
        keyboard={false}
        footer={[
          <Button
            key='submit'
            type='primary'
            disabled={!selectedTeamProject}
            onClick={() => closeWarningAndRefreshPage()}
          >
            Refresh Page
          </Button>,
        ]}
      >
        <div className='team-project-modal_modal-description'>
          Team Project has been updated in another tab. Please click refresh page to prevent errors.
        </div>
      </Modal>
    );
  }
  if (data) {
    if (data.teams.length > 0) {
      return (
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
          <TeamsDropdown
            teams={data.teams}
            selectedTeamProject={selectedTeamProject}
            setSelectedTeamProject={setSelectedTeamProject}
          />
        </Modal>
      );
    }
    return (
      <Modal
        open={isModalOpen}
        className='team-project-modal'
        title='Team Projects'
        closable={false}
        maskClosable={false}
        keyboard={false}
        footer={[
          <Button key='submit' type='primary' onClick={redirectToHomepage}>
            Ok
          </Button>,
        ]}
      >
        <div className='team-project-modal_modal-description'>
          Please reach out to{' '}
          <a href='mailto:vadc-support@gen3.org'>vadc-support@gen3.org</a>{' '}
          to gain access to the system
        </div>
      </Modal>
    );
  }
  return (
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
};

TeamProjectModal.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  setIsModalOpen: PropTypes.func.isRequired,
  isWarningModalOpen: PropTypes.bool.isRequired,
  setIsWarningModalOpen: PropTypes.func.isRequired,
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
