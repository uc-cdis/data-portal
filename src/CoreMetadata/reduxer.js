import { connect } from 'react-redux';
import CoreMetadataHeader from './CoreMetadataHeader';
import FileTypePicture from '../components/FileTypePicture';
import CoreMetadataTable from './CoreMetadataTable';
import { coreMetadataPath } from '../localconf';
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
            error: data,
          };
        }
      })
      .then(msg => dispatch(msg));

export const ReduxCoreMetadataHeader = (() => {
  const mapStateToProps = state => ({
    metadata: state.coreMetadata.metadata,
    error: state.coreMetadata.error,
    user: state.user,
    projectAvail: state.submission.projectAvail,
  });

  const mapDispatchToProps = dispatch => ({
  });

  return connect(mapStateToProps, mapDispatchToProps)(CoreMetadataHeader);
})();

export const ReduxFileTypePicture = (() => {
  const mapStateToProps = state => ({
    metadata: state.coreMetadata.metadata,
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
