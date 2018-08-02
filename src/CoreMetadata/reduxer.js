import { connect } from 'react-redux';
import CoreMetadataHeader from './CoreMetadataHeader';
import FileTypePicture from '../components/FileTypePicture';
import CoreMetadataTable from './CoreMetadataTable';
import { coreMetadataPath, userapiPath } from '../localconf';
import { fetchWithCreds } from '../actions';

export const fetchCoreMetadata = objectId =>
  dispatch =>
    fetchWithCreds({
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
            error: data.error,
          };
        }
      })
      .then(msg => dispatch(msg));

const downloadFile = id => (dispatch) => {
  const path = `${userapiPath}data/download/${id}?expires_in=10&redirect`;
  const method = 'GET';
  return fetchWithCreds({
    path,
    method,
  })
    .then(({ status, data }) => {
      switch (status) {
      case 200:
        return {
          type: 'DOWNLOAD_FILE',
          file: data,
        };
      default:
        return {
          type: 'DOWNLOAD_FILE_ERROR',
          error: data.error,
        };
      }
    })
    .then((msg) => {
      dispatch(msg);
      window.location.href = path; // redirect to download
    });
};

export const ReduxCoreMetadataHeader = (() => {
  const mapStateToProps = state => ({
    metadata: state.coreMetadata.metadata,
    user: state.user,
    projectAvail: state.submission.projectAvail,
  });

  const mapDispatchToProps = dispatch => ({
    onDownloadFile: id => dispatch(downloadFile(id)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(CoreMetadataHeader);
})();

export const ReduxFileTypePicture = (() => {
  const mapStateToProps = state => ({
    data_format: state.coreMetadata.metadata.data_format,
  });

  const mapDispatchToProps = dispatch => ({
  });

  return connect(mapStateToProps, mapDispatchToProps)(FileTypePicture);
})();

export const ReduxCoreMetadataTable = (() => {
  const mapStateToProps = state => ({
    metadata: state.coreMetadata.metadata,
  });

  const mapDispatchToProps = dispatch => ({
  });

  return connect(mapStateToProps, mapDispatchToProps)(CoreMetadataTable);
})();
