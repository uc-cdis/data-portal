import { fetchJsonOrText } from '../actions';
import { asyncSetInterval } from '../utils';
import { userapiPath, jobapiPath } from '../localconf';


export const getPresignedUrl = (did, method) => {
  const urlPath = `${userapiPath}data/${method}/${did}`;
  return fetchJsonOrText({ path: urlPath, method: 'GET' },
  ).then(
    ({ data }) => data.url,
  );
};

const getResultUploadUrl = () => {
  // hardcode result did
  const result = '77bf9442-360d-4fcf-9c82-14103c3745a2';
  return getPresignedUrl(result, 'upload');
};

const getResultDownloadUrl = () => {
  // hardcode result did
  const result = '77bf9442-360d-4fcf-9c82-14103c3745a2';
  return getPresignedUrl(result, 'download');
};


const dispatchJob = (inputURL, outputURL) => dispatch => fetchJsonOrText({
  path: `${jobapiPath}dispatch`,
  body: JSON.stringify({
    inputURL,
    outputURL,
  }),
  method: 'POST',
  dispatch,
})
  .then(
    ({ status, data }) => {
      switch (status) {
      case 200:
        return {
          type: 'RECEIVE_JOB_DISPATCH',
          data,
        };
      default:
        return {
          type: 'FETCH_ERROR',
          error: data,
        };
      }
    },
    err => ({ type: 'FETCH_ERROR', error: err }),
  )
  .then((msg) => { dispatch(msg); });


export const checkJobStatus = (dispatch, getState) => {
  const state = getState();
  let jobId = null;
  if (state.analysis.job) {
    jobId = state.analysis.job.uid;
  }
  return fetchJsonOrText({
    path: `${jobapiPath}status?UID=${jobId}`,
    method: 'GET',
    dispatch,
  }).then(
    ({ status, data }) => {
      // stop fetching job status once it stops running
      if (data.status !== 'Running') {
        clearInterval(state.analysis.jobStatusInterval);
      }
      // get the presigned url for the result to let the webpage
      // to render the result data
      if (data.status === 'Completed') {
        return getResultDownloadUrl()
          .then(resultURL => ({ type: 'RECEIVE_JOB_STATUS', data, resultURL }));
      }
      switch (status) {
      case 200:
        return {
          type: 'RECEIVE_JOB_STATUS',
          data,
        };
      default:
        return {
          type: 'FETCH_ERROR',
          error: data,
        };
      }
    },
    err => ({ type: 'FETCH_ERROR', error: err }),
  ).then((msg) => { dispatch(msg); });
};


export const submitJob = did =>
  // first get the presigned url for input download and output upload
  // then dispatch the job with those urls
  // then start pulling job status
  // save the interval id in redux that can be used to clear the timer later

  // TODO: need to get result urls from a Gen3 service
  dispatch => Promise.all([getPresignedUrl(did, 'download'), getResultUploadUrl()])
    .then(values => dispatch(dispatchJob(values[0], values[1])))
    .then(() => asyncSetInterval(() => dispatch(checkJobStatus), 1000))
    .then((intervalValue) => { dispatch({ type: 'JOB_STATUS_INTERVAL', value: intervalValue }); })
;
