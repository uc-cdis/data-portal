import { connect } from 'react-redux';
import CoreMetadataHeader from './CoreMetadataHeader';
import FileTypePicture from '../components/FileTypePicture';
import CoreMetadataTable from './CoreMetadataTable';
import CoreMetadataPage from './page';
import { peregrineVersionPath, coreMetadata, coreMetadataLegacyPath, userAPIPath } from '../localconf';
import { fetchWithCreds, updatePopup } from '../actions';

const semver = require('semver');

export const generateSignedURL = (objectId) => (dispatch) => fetchWithCreds({
  path: `${userAPIPath}data/download/${objectId}?expires_in=3600`,
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

export const fetchCoreMetadata = (objectId) => (dispatch) => {
  // if peregrine is on version 3.2.0/2023.04 or newer, or on a branch, use
  // the peregrine endpoint. if not, use the deprecated pidgin endpoint
  const minSemVer = '3.2.0';
  // We need two dots here to achieve proper comparison later with other monthly versions
  const minMonthlyRelease = semver.coerce('2023.04.0', { loose: true });
  const monthlyReleaseCutoff = semver.coerce('2020', { loose: true });

  return fetch(peregrineVersionPath)
    .then((response) => response.text())
    .then((responseBody) => {
      var peregrineVersion = JSON.parse(responseBody).version;
      var url = coreMetadataPath;
      if (peregrineVersion) {
        try {
          peregrineVersion = semver.coerce(peregrineVersion, { loose: true });
          if (
            semver.lt(peregrineVersion, minSemVer) ||
            (semver.gte(peregrineVersion, monthlyReleaseCutoff) && semver.lt(peregrineVersion, minMonthlyRelease))
          ) {
            url = coreMetadataLegacyPath;
          }
        } catch (error) { } // can't parse or compare the peregrine version: don't use legacy url
      }

      return fetchWithCreds({
        path: url + objectId,
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
    });
};

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
