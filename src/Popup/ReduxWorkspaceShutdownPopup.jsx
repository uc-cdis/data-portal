import React from 'react';
import { connect } from 'react-redux';
import Popup from '../components/Popup';
import { SessionMonitor } from '../SessionMonitor';
import { workspaceTerminateUrl } from '../localconf';
import { fetchWithCreds } from '../actions';
import './popupStyles.css';

const workspaceShutdownPopupMapState = (state) => ({
  showShutdownPopup: state.popups.showShutdownPopup,
  idleTimeLimit: state.popups.idleTimeLimit,
});

const workspaceShutdownPopupMapDispatch = (dispatch) => ({
  closeWorkspaceShutdownPopup: () => dispatch({ type: 'UPDATE_WORKSPACE_ALERT', data: { showShutdownPopup: false, showShutdownBanner: false } }),
});

const ReduxWorkspaceShutdownPopup = connect(workspaceShutdownPopupMapState, workspaceShutdownPopupMapDispatch)(
  ({ showShutdownPopup, idleTimeLimit, closeWorkspaceShutdownPopup }) => {
    if (!showShutdownPopup) {
      return null;
    }
    const handleClose = () => {
      fetchWithCreds({
        path: `${workspaceTerminateUrl}`,
        method: 'POST',
      });
      closeWorkspaceShutdownPopup();
      if (SessionMonitor.isUserOnPage('workspace')) {
        window.location.reload(); // if user is on workspace page, refresh to update
      }
    };

    return (
      <div className='popup-wrapper popup-low'>
        <Popup
          message={[`Your workspace has been terminated because it has been inactive for longer than ${idleTimeLimit / 60 / 1000} minutes.`]}
          rightButtons={[
            {
              caption: 'Close',
              fn: handleClose,
            },
          ]}
        />
      </div>
    );
  },
);

export default ReduxWorkspaceShutdownPopup;
