import { connect } from 'react-redux';
import _ from 'lodash';
import StudyDetails from './StudyDetails';
import StudyViewer from './StudyViewer';
import SingleStudyViewer from './SingleStudyViewer';
import { guppyGraphQLUrl, studyViewerConfig } from '../localconf';
import { fetchWithCreds } from '../actions';

const generateGQLQuery = (nameOfIndex, fieldsToFetch, rowAccessorField, rowAccessorValue) => {
  const query = `query ($filter: JSON) {
    ${nameOfIndex} (filter: $filter, first: 10000, accessibility: accessible) {
        ${fieldsToFetch.join(',')}
    }
  }`;
  const variables = {
    filter: {},
  };
  if (rowAccessorValue) {
    variables.filter.in = {
      [rowAccessorField]: [rowAccessorValue],
    };
  }
  return { query, variables };
};

export const fetchFiles = (dataType, typeOfFileIndex, rowAccessorValue) => {
  const targetStudyViewerConfig = studyViewerConfig.find(svc => svc.dataType === dataType);
  if (!targetStudyViewerConfig) {
    return dispatch => dispatch({
      type: 'NO_CONFIG_ERROR',
      error: `No study viewer config for ${dataType} has been found`,
    });
  }
  let nameOfIndex;
  const fieldsToFetch = ['file_name', 'file_size', 'data_format', 'data_type', targetStudyViewerConfig.rowAccessor];
  switch (typeOfFileIndex) {
  case 'object':
    nameOfIndex = targetStudyViewerConfig.fileDataType;
    fieldsToFetch.push('object_id');
    break;
  case 'open-access':
    nameOfIndex = targetStudyViewerConfig.docDataType;
    fieldsToFetch.push('doc_url');
    break;
  default:
    return dispatch => dispatch({
      type: 'FILE_DATA_ERROR',
      error: 'typeOfFileIndex error',
    });
  }

  const body = generateGQLQuery(
    nameOfIndex,
    fieldsToFetch,
    targetStudyViewerConfig.rowAccessor,
    rowAccessorValue);
  return dispatch => fetchWithCreds({
    path: guppyGraphQLUrl,
    method: 'POST',
    body: JSON.stringify(body),
    dispatch,
  }).then(({ status, data }) => {
    switch (status) {
    case 200:
      if (data.data && data.data[nameOfIndex]) {
        const receivedFileData = data.data[nameOfIndex]
          .map(d => ({ ...d, rowAccessorValue: d[targetStudyViewerConfig.rowAccessor] }));
        return {
          type: (typeOfFileIndex === 'object') ? 'RECEIVE_OBJECT_FILE_DATA' : 'RECEIVE_OPEN_DOC_DATA',
          fileData: receivedFileData,
        };
      }
      return {
        type: 'FILE_DATA_ERROR',
        error: 'Did not get correct data from Guppy',
      };
    default:
      return {
        type: 'FILE_DATA_ERROR',
        error: data,
      };
    }
  })
    .then(msg => dispatch(msg));
};

const processDataset = (nameOfIndex, data, itemConfig) => {
  const targetStudyViewerConfig = studyViewerConfig.find(svc => svc.dataType === nameOfIndex);
  const processedDataset = [];
  if (data) {
    data.forEach((dataElement) => {
      const processedItem = {};
      processedItem.title = dataElement[targetStudyViewerConfig.titleField];
      processedItem.rowAccessorValue = dataElement[targetStudyViewerConfig.rowAccessor];
      processedItem.blockData = _.pick(dataElement, itemConfig.blockFields);
      processedItem.tableData = _.pick(dataElement, itemConfig.tableFields);
      processedItem.accessibleValidationValue = dataElement.auth_resource_path;
      processedDataset.push(processedItem);
    });
  }
  return processedDataset;
};

export const fetchDataset = (dataType, rowAccessorValue) => {
  const targetStudyViewerConfig = studyViewerConfig.find(svc => svc.dataType === dataType);
  if (!targetStudyViewerConfig) {
    return dispatch => dispatch({
      type: 'NO_CONFIG_ERROR',
      error: `No study viewer config for ${dataType} has been found`,
    });
  }
  let itemConfig = targetStudyViewerConfig.listItemConfig;
  if (rowAccessorValue && targetStudyViewerConfig.singleItemConfig) {
    itemConfig = targetStudyViewerConfig.singleItemConfig;
  }

  if (!itemConfig) {
    return dispatch => dispatch({
      type: 'STUDY_DATASET_ERROR',
      error: 'itemConfig error',
    });
  }

  let fieldsToFetch = [];
  fieldsToFetch.push('auth_resource_path');
  fieldsToFetch.push(targetStudyViewerConfig.titleField);
  fieldsToFetch.push(targetStudyViewerConfig.rowAccessor);
  fieldsToFetch = [...fieldsToFetch,
    ...itemConfig.blockFields,
    ...itemConfig.tableFields];
  fieldsToFetch = _.uniq(fieldsToFetch);

  const body = generateGQLQuery(
    dataType,
    fieldsToFetch,
    targetStudyViewerConfig.rowAccessor,
    rowAccessorValue);
  return dispatch =>
    fetchWithCreds({
      path: guppyGraphQLUrl,
      method: 'POST',
      body: JSON.stringify(body),
      dispatch,
    })
      .then(({ status, data }) => {
        switch (status) {
        case 200:
          if (data.data && data.data[dataType]) {
            if (rowAccessorValue) {
              return {
                type: 'RECEIVE_SINGLE_STUDY_DATASET',
                dataset: processDataset(
                  dataType,
                  data.data[dataType],
                  itemConfig),
              };
            }
            return {
              type: 'RECEIVE_STUDY_DATASET_LIST',
              datasets: processDataset(
                dataType,
                data.data[dataType],
                itemConfig),
            };
          }
          return {
            type: 'STUDY_DATASET_ERROR',
            error: 'Did not get correct data from Guppy',
          };
        default:
          return {
            type: 'STUDY_DATASET_ERROR',
            error: data,
          };
        }
      })
      .then(msg => dispatch(msg));
};

export const resetSingleStudyData = () => dispatch => dispatch({
  type: 'RESET_SINGLE_STUDY_DATA',
});

export const resetMultipleStudyData = () => dispatch => dispatch({
  type: 'RESET_MULTIPLE_STUDY_DATA',
});

export const ReduxStudyDetails = (() => {
  const mapStateToProps = state => ({
    user: state.user,
    userAuthMapping: state.userAuthMapping,
  });

  return connect(mapStateToProps)(StudyDetails);
})();


export const ReduxStudyViewer = (() => {
  const mapStateToProps = state => ({
    datasets: state.study.datasets,
    docData: state.study.docData,
    fileData: state.study.fileData,
    noConfigError: state.study.noConfigError,
  });

  return connect(mapStateToProps)(StudyViewer);
})();

export const ReduxSingleStudyViewer = (() => {
  const mapStateToProps = state => ({
    dataset: state.study.dataset,
    docData: state.study.docData,
    fileData: state.study.fileData,
    noConfigError: state.study.noConfigError,
  });

  return connect(mapStateToProps)(SingleStudyViewer);
})();
