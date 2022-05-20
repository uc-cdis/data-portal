import React from 'react';
import { connect } from 'react-redux';
import { Alert } from 'antd';

const shutdownBannerMapState = (state) => ({
    showShutdownBanner: state.popups.showShutdownBanner,
    remainingSessionTime: state.popups.remainingSessionTime,
  });

const shutdownBannerMapDispatch = () => ({});

const ReduxAtlasShutdownPopup = connect(shutdownBannerMapState, shutdownBannerMapDispatch)(
    ({ showShutdownBanner, remainingSessionTime }) => {
      if (!showShutdownBanner) {
        return null;
      }
      const remainingTimeInMinutes = (Math.ceil(remainingSessionTime / 60 / 1000));
      return (
        <Alert
          message={(
            <React.Fragment>
              Your session will be terminated in <b>{remainingTimeInMinutes}</b> {` ${(remainingTimeInMinutes === 1) ? 'minute' : 'minutes'}`} due to inactivity. Close this to refresh session.
            </React.Fragment>
          )}
          banner
        />
      );
    },
  );

export default ReduxAtlasShutdownPopup;
