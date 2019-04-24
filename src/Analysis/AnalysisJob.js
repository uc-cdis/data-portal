import { fetchWithCreds } from '../actions';
import { asyncSetInterval } from '../utils';
import { userapiPath, jobapiPath } from '../localconf';


export const getPresignedUrl = (did, method) => {
  const urlPath = `${userapiPath}data/${method}/${did}`;
  return fetchWithCreds({ path: urlPath, method: 'GET' },
  ).then(
    ({ data }) => data.url,
  );
};

export const dispatchJob = body => dispatch => fetchWithCreds({
  path: `${jobapiPath}dispatch`,
  body: JSON.stringify(body),
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
  return fetchWithCreds({
    path: `${jobapiPath}status?UID=${jobId}`,
    method: 'GET',
    dispatch,
  }).then(
    ({ status, data }) => {
      // stop fetching job status once it stops running
      if (data.status !== 'Running') {
        clearInterval(state.analysis.jobStatusInterval);
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

// dispatch the job with body
// then start pulling job status
// save the interval id in redux that can be used to clear the timer later

// TODO: need to get result urls from a Gen3 service
export const submitJob = body => dispatch => dispatch(dispatchJob(body));

export const checkJob = () => dispatch =>
  asyncSetInterval(() => dispatch(checkJobStatus), 1000)
    .then((intervalValue) => {
      dispatch({ type: 'JOB_STATUS_INTERVAL', value: intervalValue });
    });

export const fetchJobResult = jobId => dispatch =>
  fetchWithCreds({
    path: `${jobapiPath}output?UID=${jobId}`,
    method: 'GET',
    dispatch,
  }).then(data => data);

export const resetJobState = () => dispatch => dispatch({ type: 'RESET_JOB' });
