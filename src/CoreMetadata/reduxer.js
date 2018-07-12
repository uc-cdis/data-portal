import { connect } from 'react-redux';
import CoreMetadataHeader from '../components/CoreMetadataHeader'
import FileTypePicture from '../components/FileTypePicture'
import CoreMetadataTable from '../components/tables/CoreMetadataTable'
import { coreMetadataPath } from '../localconf';
import { fetchWithCreds } from '../actions';

export const fetchCoreMetadata = (object_id) =>
  dispatch =>
    fetchWithCreds({
      path: coreMetadataPath + object_id,
      dispatch,
    })
      .then(
        ({ status, data }) => {
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
        },
      )
      .then(msg => dispatch(msg));

export const ReduxCoreMetadataHeader = (() => {
  const mapStateToProps = (state) => ({
    metadata: state.coreMetadata.metadata
  });

  const mapDispatchToProps = dispatch => ({
  });

  return connect(mapStateToProps, mapDispatchToProps)(CoreMetadataHeader);
})();

export const ReduxFileTypePicture = (() => {
  const mapStateToProps = (state) => ({
    data_format: state.coreMetadata.metadata.data_format
  });

  const mapDispatchToProps = dispatch => ({
  });

  return connect(mapStateToProps, mapDispatchToProps)(FileTypePicture);
})();

export const ReduxCoreMetadataTable = (() => {
  const mapStateToProps = (state) => ({
    metadata: state.coreMetadata.metadata
  });

  const mapDispatchToProps = dispatch => ({
  });

  return connect(mapStateToProps, mapDispatchToProps)(CoreMetadataTable);
})();
