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
        message={`Your workspace will be terminated in ${remainingTimeInMinutes} ${(remainingTimeInMinutes === 1) ? 'minute' : 'minutes'} due to inactivity. Navigate to the workspace soon if you have unsaved data.`}
        banner
      />
    );
  },
);

export default ReduxWorkspaceShutdownPopup;
