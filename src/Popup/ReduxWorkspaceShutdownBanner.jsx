import React from 'react';
import { connect } from 'react-redux';
import { Alert } from 'antd';

const timeoutPopupMapState = (state) => ({
  showShutdownBanner: state.popups.showShutdownBanner,
  remainingWorkspaceKernelLife: state.popups.remainingWorkspaceKernelLife,
});

const timeoutPopupMapDispatch = () => ({});

const ReduxWorkspaceShutdownPopup = connect(timeoutPopupMapState, timeoutPopupMapDispatch)(
  ({ showShutdownBanner, remainingWorkspaceKernelLife }) => {
    if (!showShutdownBanner) {
      return null;
    }
    const remainingTimeInMinutes = (Math.ceil(remainingWorkspaceKernelLife / 60 / 1000));
    return (
      <Alert
        message={(
          <React.Fragment>
            Your workspace will be terminated in <b>{remainingTimeInMinutes}</b> {` ${(remainingTimeInMinutes === 1) ? 'minute' : 'minutes'}`} due to inactivity. Navigate to the workspace soon if you have unsaved data.
          </React.Fragment>
        )}
        banner
      />
    );
  },
);

export default ReduxWorkspaceShutdownPopup;
