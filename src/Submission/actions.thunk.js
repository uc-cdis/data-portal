import { connectionError, fetchErrored } from '../actions';
import { fetchWithCreds } from '../actions.thunk';
import {
  indexdPath,
  lineLimit,
  submissionApiPath,
  useIndexdAuthz,
} from '../localconf';
import { predictFileType } from '../utils';
import {
  receiveCounts,
  receiveDictionary,
  receiveSubmission,
  receiveUnmappedFiles,
  receiveUnmappedFileStatistics,
  requestUpload,
  resetSubmissionStatus,
  updateFile,
} from './actions';
import { buildCountsQuery, FETCH_LIMIT } from './utils';

/** @typedef {import('redux').AnyAction} AnyAction */
/** @typedef {import('redux').Dispatch} Dispatch */
/** @typedef {import('redux-thunk').ThunkDispatch} ThunkDispatch */
/** @typedef {import('./types').SubmissionState} SubmissionState */
export function fetchDictionary() {
  /**
   * @param {Dispatch} dispatch
   * @param {() => { submission: SubmissionState }} getState
   */
  return (dispatch, getState) =>
    getState().submission.dictionary
      ? Promise.resolve()
      : import('../../data/dictionary.json').then(({ default: data }) =>
          dispatch(receiveDictionary(data))
        );
}

/**
 * @param {import('../types').UserState['username']} username
 * @param {SubmissionState['unmappedFiles']} total
 * @param {string} start
 */
export const fetchUnmappedFiles =
  (username, total, start) => (/** @type {ThunkDispatch} */ dispatch) => {
    const unmappedFilesCheck = useIndexdAuthz ? 'authz=null' : 'acl=null';
    return fetchWithCreds({
      path: `${indexdPath}index?${unmappedFilesCheck}&uploader=${username}&start=${start}&limit=${FETCH_LIMIT}`,
      method: 'GET',
    })
      .then(({ status, data }) => {
        const files = total.concat(data.records ?? []);
        switch (status) {
          case 200:
            if (data.records?.length === FETCH_LIMIT) {
              return dispatch(
                fetchUnmappedFiles(
                  username,
                  files,
                  data.records[FETCH_LIMIT - 1].did
                )
              );
            }
            return receiveUnmappedFiles(files);
          default:
            return fetchErrored(data.records);
        }
      }, fetchErrored)
      .then((msg) => {
        if (msg) dispatch(msg);
      });
  };

/**
 * @param {import('../types').UserState['username']} username
 * @param {SubmissionState['unmappedFiles']} total
 * @param {string} start
 * @returns
 */
export const fetchUnmappedFileStats =
  (username, total, start) => (/** @type {ThunkDispatch} */ dispatch) => {
    const unmappedFilesCheck = useIndexdAuthz ? 'authz=null' : 'acl=null';
    return fetchWithCreds({
      path: `${indexdPath}index?${unmappedFilesCheck}&uploader=${username}&start=${start}&limit=${FETCH_LIMIT}`,
      method: 'GET',
    })
      .then(({ status, data }) => {
        const files = total.concat(data.records ?? []);
        switch (status) {
          case 200:
            if (data.records?.length === FETCH_LIMIT) {
              return dispatch(
                fetchUnmappedFileStats(
                  username,
                  files,
                  data.records[FETCH_LIMIT - 1].did
                )
              );
            }
            return receiveUnmappedFileStatistics({
              unmappedFileCount: files.length,
              unmappedFileSize: files.reduce(
                /**
                 * @param {number} size
                 * @param {Object} current
                 */
                (size, current) => size + current.size,
                0
              ),
            });

          default:
            return fetchErrored(data.records);
        }
      }, fetchErrored)
      .then((msg) => {
        if (msg) dispatch(msg);
      });
  };

/**
 * Compose and send a single graphql query to get a count of how
 * many of each node and edge are in the current state
 * @param {string} project
 */
export const getCounts =
  (project) =>
  /**
   * @param {Dispatch} dispatch
   * @param {() => { submission: SubmissionState }} getState
   */
  (dispatch, getState) => {
    const { dictionary, nodeTypes } = getState().submission;
    return fetchWithCreds({
      path: `${submissionApiPath}graphql`,
      body: JSON.stringify({
        query: buildCountsQuery(dictionary, nodeTypes, project),
      }),
      method: 'POST',
      onError: () => dispatch(connectionError()),
    })
      .then(({ status, data }) => {
        switch (status) {
          case 200:
            return receiveCounts(data.data);
          default:
            return fetchErrored(data.data);
        }
      }, fetchErrored)
      .then((msg) => {
        dispatch(msg);
      });
  };

/**
 * @param {Object} args
 * @param {string} args.fullProject
 * @param {string} [args.methodIn]
 * @param {() => void} [args.callback]
 */
export const submitToServer =
  ({ fullProject, methodIn = 'PUT', callback }) =>
  /**
   * @param {Dispatch} dispatch
   * @param {() => { submission: SubmissionState }} getState
   */
  (dispatch, getState) => {
    dispatch(resetSubmissionStatus());

    /** @type {string[]} */
    const fileArray = [];
    const path = fullProject.split('-');
    const program = path[0];
    const project = path.slice(1).join('-');
    const { submission } = getState();
    const method = /* path === 'graphql' ? 'POST' : */ methodIn;

    let { file } = submission;
    if (!file) {
      return Promise.reject(new Error('No file to submit'));
    }
    if (submission.file_type !== 'text/tab-separated-values') {
      // remove line break in json file
      file = file.replace(/\r\n?|\n/g, '');
    }

    if (submission.file_type === 'text/tab-separated-values') {
      const fileSplited = file.split(/\r\n?|\n/g);
      if (fileSplited.length > lineLimit && lineLimit > 0) {
        let fileHeader = fileSplited[0];
        fileHeader += '\n';
        let count = lineLimit;
        let fileChunk = fileHeader;

        for (let i = 1; i < fileSplited.length; i += 1) {
          if (fileSplited[i] !== '') {
            fileChunk += fileSplited[i];
            fileChunk += '\n';
            count -= 1;
          }
          if (count === 0) {
            fileArray.push(fileChunk);
            fileChunk = fileHeader;
            count = lineLimit;
          }
        }
        if (fileChunk !== fileHeader) {
          fileArray.push(fileChunk);
        }
      } else {
        fileArray.push(file);
      }
    } else {
      fileArray.push(file);
    }

    let subUrl = submissionApiPath;
    if (program !== '_root') {
      subUrl = `${subUrl + program}/${project}/`;
    }

    const totalChunk = fileArray.length;

    /** @param {string[]} chunkArray */
    function recursiveFetch(chunkArray) {
      if (chunkArray.length === 0) {
        return null;
      }

      return fetchWithCreds({
        path: subUrl,
        method,
        customHeaders: new Headers({ 'Content-Type': submission.file_type }),
        body: chunkArray.shift(),
        onError: () => dispatch(connectionError()),
      })
        .then(recursiveFetch(chunkArray))
        .then(({ status, data }) =>
          receiveSubmission({
            data,
            submit_status: status,
            submit_total: totalChunk,
          })
        )
        .then((msg) => dispatch(msg))
        .then(callback);
    }

    return recursiveFetch(fileArray);
  };

/**
 * @param {SubmissionState['file']} value
 * @param {SubmissionState['file_type']} type
 */
export const uploadTSV =
  (value, type) => (/** @type {Dispatch} */ dispatch) => {
    dispatch(requestUpload({ file: value, file_type: type }));
  };

/**
 * @param {SubmissionState['file']} value
 * @param {string} [fileType]
 */
export const updateFileContent =
  (value, fileType) => (/** @type {Dispatch} */ dispatch) => {
    dispatch(
      updateFile({
        file: value,
        file_type: predictFileType(value, fileType),
      })
    );
  };
