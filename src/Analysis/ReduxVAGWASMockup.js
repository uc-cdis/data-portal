import { connect } from 'react-redux';
import { workspaceStorageListUrl, workspaceStorageDownloadUrl } from '../localconf';
import { fetchWithCreds } from '../actions';
import VAGWASMockup from './VAGWASMockup';

const papaparse = require('papaparse');

const fetchWorkspaceStorageFileList = () => dispatch => fetchWithCreds({
  path: `${workspaceStorageListUrl}/@user`,
  method: 'GET',
  dispatch,
}).then(({ status, data }) => {
  switch (status) {
  case 200:
    if (data.Data && data.Data.Objects) {
      return {
        type: 'RECEIVE_WSS_FILE_LIST',
        wssFileObjects: data.Data.Objects.map(obj => ({ key: obj.WorkspaceKey, ...obj })),
        wssFilePrefix: data.Data.Prefix,
      };
    }
    return {
      type: 'WSS_LIST_FILE_ERROR',
      error: 'Unable to list data from WSS',
    };
  default:
    return {
      type: 'WSS_LIST_FILE_ERROR',
      error: `Unable to list data from WSS with error code ${status}`,
    };
  }
})
  .then(msg => dispatch(msg));

async function readTSV(tsvData) {
  const result = [];
  const parseFile = rawFile => new Promise((resolve) => {
    papaparse.parse(rawFile, {
      worker: true,
      header: true,
      skipEmptyLines: true,
      step(row) {
        result.push(row.data);
      },
      complete: () => resolve(result),
    });
  });
  let parsedData = await parseFile(tsvData);
  parsedData = parsedData.map((d, i) => ({ key: `data_${i}`, ...d }));
  return parsedData;
}

const fetchWorkspaceStorageFile = workspaceKey => dispatch => fetchWithCreds({
  path: `${workspaceStorageDownloadUrl}/@user/${workspaceKey}`,
  method: 'GET',
  dispatch,
}).then(({ status, data }) => {
  switch (status) {
  case 200:
    if (data.Data) {
      fetch(data.Data).then(
        (response) => {
          if (response.ok) {
            response.text().then((text) => {
              readTSV(text).then(parsedData => ({
                type: 'RECEIVE_WSS_FILE',
                wssFileData: { workspaceKey, fileData: parsedData },
              })).then(msg => dispatch(msg));
            });
            return null;
          }
          return {
            type: 'WSS_FILE_DOWNLOAD_URL_ERROR',
            error: `Unable to fetch from download URL for data key ${workspaceKey} from WSS`,
          };
        },
      );
    }
    return {
      type: 'WSS_FILE_DOWNLOAD_URL_ERROR',
      error: `Unable to get download URL for data key ${workspaceKey} from WSS`,
    };
  default:
    return {
      type: 'WSS_FILE_DOWNLOAD_URL_ERROR',
      error: `Unable to get download URL for data key ${workspaceKey} from WSS with error code ${status}`,
    };
  }
})
  .then(msg => dispatch(msg));

const mapStateToProps = state => ({
  wssFileObjects: state.analysis.wssFileObjects,
  wssFilePrefix: state.analysis.wssFilePrefix,
  wssListFileError: state.analysis.wssListFileError,
  wssFileData: state.analysis.wssFileData,
});

const mapDispatchToProps = dispatch => ({
  onLoadWorkspaceStorageFileList: (() => dispatch(fetchWorkspaceStorageFileList())),
  onLoadWorkspaceStorageFile: (workspaceKey => dispatch(fetchWorkspaceStorageFile(workspaceKey))),
});

const ReduxVAGWASMockup = connect(mapStateToProps, mapDispatchToProps)(VAGWASMockup);
export default ReduxVAGWASMockup;
