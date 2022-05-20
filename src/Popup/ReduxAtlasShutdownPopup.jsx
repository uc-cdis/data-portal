import React from 'react';
import { connect } from 'react-redux';
import Popup from '../components/Popup';
// import { SessionMonitor } from '../SessionMonitor';

const atlasShutdownPopupMapState = (state) => ({
    showShutdownPopup: state.popups.showShutdownPopup,
    idleTimeLimit: state.popups.idleTimeLimit,
});

const atlasShutdownPopupMapDispatch = (dispatch) => ({
    closeAtlasShutdownPopup: () => dispatch({ type: 'UPDATE_ATLAS_ALERT', data: { showShutdownPopup: false, showShutdownBanner: false } }),
  });

  const ReduxAtlasShutdownPopup = connect(atlasShutdownPopupMapState, atlasShutdownPopupMapDispatch)(
    ({ showShutdownPopup, idleTimeLimit, closeAtlasShutdownPopup }) => {
      if (!showShutdownPopup) {
        return null;
      }
      const handleClose = () => {
        closeAtlasShutdownPopup();

        // TODO: check somehow if user is on atlas page instead (url contains `OHDSI%20Atlas`)
        // if (SessionMonitor.isUserOnPage('atlas')) {
        //   window.location.reload(); // if user is on workspace page, refresh to update
        // }
      };

      return (
        <Popup
          message={`Your session has been terminated because it has been inactive for longer than ${idleTimeLimit / 60 / 1000} minutes.`}
          rightButtons={[
            {
              caption: 'Close',
              fn: handleClose,
            },
          ]}
        />
      );
    },
  );

  export default ReduxAtlasShutdownPopup;
