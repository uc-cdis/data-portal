import { connect } from 'react-redux';
import _ from 'lodash';
import { withRouter } from 'react-router-dom';
import StudyDetails from './StudyDetails';
import StudyViewer from './StudyViewer';
import ExportToWorkspace from './ExportToWorkspace';
import SingleStudyViewer from './SingleStudyViewer';
import { guppyGraphQLUrl, studyViewerConfig, requestorPath } from '../localconf';
import { fetchWithCreds } from '../actions';
import {
  dispatchJob, checkJob, fetchJobResult, resetJobState,
} from '../Analysis/AnalysisJob';

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

export const fetchStudyViewerConfig = (dataType) => studyViewerConfig
  .find((svc) => svc.dataType === dataType);

export const fetchFiles = (dataType, typeOfFileIndex, rowAccessorValue) => {
  const targetStudyViewerConfig = fetchStudyViewerConfig(dataType);
  if (!targetStudyViewerConfig) {
    return (dispatch) => dispatch({
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
    return (dispatch) => dispatch({
      type: 'FILE_DATA_ERROR',
      error: 'typeOfFileIndex error',
    });
  }

  if (!nameOfIndex) {
    return (dispatch) => dispatch({
      type: 'FILE_DATA_ERROR',
      error: `No index specified for file type: ${typeOfFileIndex}`,
    });
  }

  const body = generateGQLQuery(
    nameOfIndex,
    fieldsToFetch,
    targetStudyViewerConfig.rowAccessor,
    rowAccessorValue);
  return (dispatch) => fetchWithCreds({
    path: guppyGraphQLUrl,
    method: 'POST',
    body: JSON.stringify(body),
    dispatch,
  }).then(({ status, data }) => {
    switch (status) {
    case 200:
      if (data.data && data.data[nameOfIndex]) {
        const receivedFileData = data.data[nameOfIndex]
          .map((d) => ({ ...d, rowAccessorValue: d[targetStudyViewerConfig.rowAccessor] }));
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
    .then((msg) => dispatch(msg));
};

const fetchRequestedAccess = (receivedData) => {
  const accessibleValidationValueArray = receivedData.map((d) => d.auth_resource_path);
  const body = {
    resource_paths: accessibleValidationValueArray,
  };
  return fetchWithCreds({
    path: `${requestorPath}request/user_resource_paths`,
    method: 'POST',
    body: JSON.stringify(body),
  }).then(
    ({ status, data }) => {
      switch (status) {
        case 200:
          return data;
        default:
          console.error('Unable to get requested access:', status, data);
          return {};
        }
    },
  );
};

const removeEmptyFields = (inputObj, flag) => {
  if (flag) {
    return _.omitBy(inputObj, _.isNil);
  }
  return inputObj;
};

const processDataset = (nameOfIndex, receivedData, itemConfig, displayButtonsFields) => {
  const targetStudyViewerConfig = fetchStudyViewerConfig(nameOfIndex);
  const processedDataset = [];
  if (receivedData) {
    return fetchRequestedAccess(receivedData).then(
      (requestedAccess) => {
        receivedData.forEach((dataElement) => {
          const processedItem = {};
          processedItem.title = dataElement[targetStudyViewerConfig.titleField];
          processedItem.rowAccessorValue = dataElement[targetStudyViewerConfig.rowAccessor];
          processedItem.blockData = _.pick(dataElement, itemConfig.blockFields);
          processedItem.tableData = removeEmptyFields(_.pick(dataElement, itemConfig.tableFields), itemConfig.hideEmptyFields);
          processedItem.displayButtonsData = _.pick(dataElement, displayButtonsFields);
          processedItem.accessibleValidationValue = dataElement.auth_resource_path;
          processedItem.accessRequested = !!(requestedAccess
          && requestedAccess[dataElement.auth_resource_path]);
          processedDataset.push(processedItem);
        });
      },
    ).then(() => processedDataset);
  }
  return processedDataset;
};

export const fetchDataset = (dataType, rowAccessorValue) => {
  const targetStudyViewerConfig = fetchStudyViewerConfig(dataType);
  if (!targetStudyViewerConfig) {
    return (dispatch) => dispatch({
      type: 'NO_CONFIG_ERROR',
      error: `No study viewer config for ${dataType} has been found`,
    });
  }
  let itemConfig = targetStudyViewerConfig.listItemConfig;
  if (rowAccessorValue && targetStudyViewerConfig.singleItemConfig) {
    itemConfig = targetStudyViewerConfig.singleItemConfig;
  }

  if (!itemConfig) {
    return (dispatch) => dispatch({
      type: 'STUDY_DATASET_ERROR',
      error: 'itemConfig error',
    });
  }

  let fieldsToFetch = [];
  fieldsToFetch.push('auth_resource_path');
  fieldsToFetch.push(targetStudyViewerConfig.titleField);
  fieldsToFetch.push(targetStudyViewerConfig.rowAccessor);
  const displayButtonsFields = targetStudyViewerConfig.buttons
    ? targetStudyViewerConfig.buttons.map((b) => b.enableButtonField) : [];
  fieldsToFetch = [
    ...fieldsToFetch,
    ...itemConfig.blockFields,
    ...itemConfig.tableFields,
    ...displayButtonsFields,
  ];
  fieldsToFetch = _.uniq(fieldsToFetch);

  const body = generateGQLQuery(
    dataType,
    fieldsToFetch,
    targetStudyViewerConfig.rowAccessor,
    rowAccessorValue);

  return (dispatch) => fetchWithCreds({
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
            return processDataset(
              dataType,
              data.data[dataType],
              itemConfig,
              displayButtonsFields,
            ).then((pd) => ({
              type: 'RECEIVE_SINGLE_STUDY_DATASET',
              datasets: pd,
            })).then((msg) => msg);
          }
          return processDataset(
            dataType,
            data.data[dataType],
            itemConfig,
            displayButtonsFields,
          ).then((pd) => ({
            type: 'RECEIVE_STUDY_DATASET_LIST',
            datasets: pd,
          })).then((msg) => msg);
        }
        return {
          type: 'STUDY_DATASET_ERROR',
          error: 'Did not get correct data from Guppy',
        };
      default:
        return {
          type: 'STUDY_DATASET_ERROR',
          error: (data && data.errors && data.errors[0] && data.errors[0].message) ? data.errors[0].message : 'Did not get correct data from Guppy',
        };
      }
    })
    .then((msg) => {
      dispatch(msg);
    });
};

export const resetSingleStudyData = () => (dispatch) => dispatch({
  type: 'RESET_SINGLE_STUDY_DATA',
});

export const resetMultipleStudyData = () => (dispatch) => dispatch({
  type: 'RESET_MULTIPLE_STUDY_DATA',
});

export const ReduxStudyDetails = (() => {
  const mapStateToProps = (state) => ({
    user: state.user,
    userAuthMapping: state.userAuthMapping,
    userAccess: state.userAccess.access,
  });

  return withRouter(connect(mapStateToProps)(StudyDetails));
})();

export const ReduxStudyViewer = (() => {
  const mapStateToProps = (state) => ({
    datasets: state.study.datasets,
    docData: state.study.docData,
    fileData: state.study.fileData,
    noConfigError: state.study.noConfigError,
  });

  return withRouter(connect(mapStateToProps)(StudyViewer));
})();

export const ReduxSingleStudyViewer = (() => {
  const mapStateToProps = (state) => ({
    dataset: state.study.dataset,
    docData: state.study.docData,
    fileData: state.study.fileData,
    noConfigError: state.study.noConfigError,
  });

  return withRouter(connect(mapStateToProps)(SingleStudyViewer));
})();

export const ReduxExportToWorkspace = (() => {
  const mapStateToProps = (state) => ({
    job: state.analysis.job,
  });
  const mapDispatchToProps = (dispatch) => ({
    submitJob: (body) => dispatch(dispatchJob(body)),
    checkJobStatus: () => dispatch(checkJob()),
    fetchJobResult: (jobId) => dispatch(fetchJobResult(jobId)),
    resetJobState: () => dispatch(resetJobState()),
  });

  return withRouter(connect(mapStateToProps, mapDispatchToProps)(ExportToWorkspace));
})();
