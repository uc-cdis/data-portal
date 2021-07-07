import { connect } from 'react-redux';
import CoreMetadataHeader from './CoreMetadataHeader';
import FileTypePicture from '../components/FileTypePicture';
import CoreMetadataTable from './CoreMetadataTable';
import CoreMetadataPage from './page';
import { coreMetadataPath, userAPIPath } from '../localconf';
import { fetchWithCreds, updatePopup } from '../actions';

export const generateSignedURL = (objectId) => (dispatch) => fetchWithCreds({
  path: `${userAPIPath}/data/download/${objectId}?expires_in=3600`,
  dispatch,
})
  .then(
    ({ status, data }) => {
      switch (status) {
      case 200:
        dispatch({
          type: 'RECEIVE_SIGNED_URL',
          url: data.url,
        });
        return dispatch(updatePopup({ signedURLPopup: true }));
      default:
        dispatch({
          type: 'SIGNED_URL_ERROR',
          error: `Error occurred during generating signed URL. Error code: ${status}`,
        });
        return dispatch(updatePopup({ signedURLPopup: true }));
      }
    },
  );

const clearSignedURL = () => ({
  type: 'CLEAR_SIGNED_URL',
});

export const fetchCoreMetadata = (objectId) => (dispatch) => fetchWithCreds({
  path: coreMetadataPath + objectId,
  customHeaders: { Accept: 'application/json' },
  dispatch,
})
  .then(({ status, data }) => {
    switch (status) {
    case 200:
      return {
        type: 'RECEIVE_CORE_METADATA',
        metadata: data,
      };
    default:
      return {
        type: 'CORE_METADATA_ERROR',
        error: data,
      };
    }
  })
  .then((msg) => dispatch(msg));

export const ReduxCoreMetadataHeader = (() => {
  const mapStateToProps = (state) => ({
    metadata: state.coreMetadata.metadata,
    signedURL: state.coreMetadata.url,
    signedURLPopup: state.popups.signedURLPopup,
    error: state.coreMetadata.error,
    userAuthMapping: state.userAuthMapping,
    projectAvail: state.submission.projectAvail,
  });

  const mapDispatchToProps = (dispatch) => ({
    onGenerateSignedURL: (objectId) => dispatch(generateSignedURL(objectId)),
    onUpdatePopup: (state) => dispatch(updatePopup(state)),
    onClearSignedURL: () => dispatch(clearSignedURL()),
  });

  return connect(mapStateToProps, mapDispatchToProps)(CoreMetadataHeader);
})();

export const ReduxFileTypePicture = (() => {
  const mapStateToProps = (state) => ({
    metadata: state.coreMetadata.metadata,
  });

  const mapDispatchToProps = (dispatch) => ({
  });

  return connect(mapStateToProps, mapDispatchToProps)(FileTypePicture);
})();

export const ReduxCoreMetadataTable = (() => {
  const mapStateToProps = (state) => ({
    metadata: state.coreMetadata.metadata,
  });

  const mapDispatchToProps = (dispatch) => ({
  });

  return connect(mapStateToProps, mapDispatchToProps)(CoreMetadataTable);
})();

export const ReduxCoreMetadataPage = (() => {
  const mapStateToProps = (state) => ({
    error: state.coreMetadata.error,
  });

  return connect(mapStateToProps)(CoreMetadataPage);
})();
