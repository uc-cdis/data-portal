import { connect } from 'react-redux';
import _ from 'lodash';
import StudyDetails from './StudyDetails';
import StudyViewer from './StudyViewer';
import SingleStudyViewer from './SingleStudyViewer';
import { guppyGraphQLUrl, studyViewerConfig } from '../localconf';
import { fetchWithCreds } from '../actions';

const processDataset = (data, itemConfig, fileConfig) => {
  const processedDataset = [];
  data.forEach((dataElement) => {
    const processedItem = {};
    processedItem.title = dataElement[itemConfig.officialTitleField];
    if (itemConfig.briefTitleField) {
      processedItem.briefTitle = dataElement[itemConfig.briefTitleField];
    }
    processedItem.blockData = _.pick(dataElement, itemConfig.blockFields);
    processedItem.tableData = _.pick(dataElement, itemConfig.tableFields);
    if (fileConfig) {
      processedItem.fileData = {};
      processedItem.fileData.guid = dataElement[fileConfig.downloadField];
      if (fileConfig.fileFields) {
        processedItem.fileData.fileFields = _.pick(dataElement, fileConfig.fileFields);
      }
    }
    if (studyViewerConfig.accessibleValidationField) {
      // eslint-disable-next-line max-len
      processedItem.accessibleValidationValue = dataElement[studyViewerConfig.accessibleValidationField];
    }
    processedDataset.push(processedItem);
  });
  return processedDataset;
};

export const fetchDataset = (titleOfDataset) => {
  let itemConfig = studyViewerConfig.listItemConfig;
  if (titleOfDataset && studyViewerConfig.singleItemConfig) {
    itemConfig = studyViewerConfig.singleItemConfig;
  }

  if (!itemConfig) {
    return dispatch => dispatch({
      type: 'STUDY_DATASET_ERROR',
      error: 'itemConfig error',
    });
  }

  let fieldsToFetch = [];
  fieldsToFetch.push(itemConfig.officialTitleField);
  if (studyViewerConfig.accessibleValidationField) {
    fieldsToFetch.push(studyViewerConfig.accessibleValidationField);
  }
  if (itemConfig.briefTitleField) {
    fieldsToFetch.push(itemConfig.briefTitleField);
  }
  fieldsToFetch = [...fieldsToFetch,
    ...itemConfig.blockFields,
    ...itemConfig.tableFields];
  let fileConfig;
  if (titleOfDataset) {
    fileConfig = {};
    fieldsToFetch.push(studyViewerConfig.downloadField);
    fileConfig.downloadField = studyViewerConfig.downloadField;
    if (studyViewerConfig.fileFields) {
      fieldsToFetch = [...fieldsToFetch, ...studyViewerConfig.fileFields];
      fileConfig.fileFields = studyViewerConfig.fileFields;
    }
  }
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
  if (titleOfDataset) {
    variables.filter.AND.push({
      in: {
        [itemConfig.officialTitleField]: [titleOfDataset],
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
                itemConfig,
                fileConfig),
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
  });

  return connect(mapStateToProps)(StudyViewer);
})();

export const ReduxSingleStudyViewer = (() => {
  const mapStateToProps = state => ({
    dataset: state.study.dataset,
  });

  return connect(mapStateToProps)(SingleStudyViewer);
})();
