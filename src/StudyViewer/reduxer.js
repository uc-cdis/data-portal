import { connect } from 'react-redux';
import _ from 'lodash';
import StudyDetails from './StudyDetails';
import StudyViewer from './StudyViewer';
import SingleStudyViewer from './SingleStudyViewer';
import { guppyGraphQLUrl, studyViewerConfig } from '../localconf';
import { fetchWithCreds } from '../actions';

export const fetchFiles = (typeOfFileIndex, rowAccessorValue) => {
  let nameOfIndex;
  const fieldsToFetch = ['file_name', 'file_size', 'data_format', 'data_type', studyViewerConfig.rowAccessor];
  switch (typeOfFileIndex) {
  case 'object':
    nameOfIndex = studyViewerConfig.fileDataType;
    fieldsToFetch.push('object_id');
    break;
  case 'open-access':
    nameOfIndex = studyViewerConfig.docDataType;
    fieldsToFetch.push('doc_url');
    break;
  default:
    return dispatch => dispatch({
      type: 'FILE_DATA_ERROR',
      error: 'typeOfFileIndex error',
    });
  }
  const query = `query ($filter: JSON) {
    ${nameOfIndex} (filter: $filter, first: 10000, accessibility: accessible) {
        ${fieldsToFetch.join(',')}
    }
  }`;
  const variables = {
    filter: {
      AND: [],
    },
  };
  if (rowAccessorValue) {
    variables.filter.AND.push({
      in: {
        [studyViewerConfig.rowAccessor]: [rowAccessorValue],
      },
    });
  }
  const body = { query, variables };
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
          .map(d => ({ ...d, rowAccessorValue: d[studyViewerConfig.rowAccessor] }));
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

const processDataset = (data, itemConfig) => {
  const processedDataset = [];
  data.forEach((dataElement) => {
    const processedItem = {};
    processedItem.title = dataElement[studyViewerConfig.titleField];
    processedItem.rowAccessorValue = dataElement[studyViewerConfig.rowAccessor];
    processedItem.blockData = _.pick(dataElement, itemConfig.blockFields);
    processedItem.tableData = _.pick(dataElement, itemConfig.tableFields);
    processedItem.accessibleValidationValue = dataElement.auth_resource_path;
    processedDataset.push(processedItem);
  });
  return processedDataset;
};

export const fetchDataset = (rowAccessorValue) => {
  let itemConfig = studyViewerConfig.listItemConfig;
  if (rowAccessorValue && studyViewerConfig.singleItemConfig) {
    itemConfig = studyViewerConfig.singleItemConfig;
  }

  if (!itemConfig) {
    return dispatch => dispatch({
      type: 'STUDY_DATASET_ERROR',
      error: 'itemConfig error',
    });
  }

  let fieldsToFetch = [];
  fieldsToFetch.push('auth_resource_path');
  fieldsToFetch.push(studyViewerConfig.titleField);
  fieldsToFetch.push(studyViewerConfig.rowAccessor);
  fieldsToFetch = [...fieldsToFetch,
    ...itemConfig.blockFields,
    ...itemConfig.tableFields];
  fieldsToFetch = _.uniq(fieldsToFetch);

  const query = `query ($filter: JSON) {
        ${studyViewerConfig.dataType} (filter: $filter, first: 10000, accessibility: accessible) {
            ${fieldsToFetch.join(',')}
        }
      }`;
  const variables = {
    filter: {
      AND: [],
    },
  };
  if (rowAccessorValue) {
    variables.filter.AND.push({
      in: {
        [studyViewerConfig.rowAccessor]: [rowAccessorValue],
      },
    });
  }
  const body = { query, variables };
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
          if (data.data && data.data[studyViewerConfig.dataType]) {
            return {
              type: 'RECEIVE_STUDY_DATASET',
              dataset: processDataset(
                data.data[studyViewerConfig.dataType],
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

export const ReduxStudyDetails = (() => {
  const mapStateToProps = state => ({
    user: state.user,
    userAuthMapping: state.userAuthMapping,
    projectAvail: state.submission.projectAvail,
  });

  return connect(mapStateToProps)(StudyDetails);
})();


export const ReduxStudyViewer = (() => {
  const mapStateToProps = state => ({
    dataset: state.study.dataset,
    docData: state.study.docData,
    fileData: state.study.fileData,
  });

  return connect(mapStateToProps)(StudyViewer);
})();

export const ReduxSingleStudyViewer = (() => {
  const mapStateToProps = state => ({
    dataset: state.study.dataset,
    docData: state.study.docData,
    fileData: state.study.fileData,
  });

  return connect(mapStateToProps)(SingleStudyViewer);
})();
