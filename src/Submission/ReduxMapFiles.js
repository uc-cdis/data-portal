import { connect } from 'react-redux';
import MapFiles from './MapFiles';
import { fetchWithCreds } from '../actions';
import { STARTING_DID, FETCH_LIMIT } from './utils';
import { indexdPath, useIndexdAuthz } from '../localconf';

const fetchUnmappedFiles = (user, total, start) => (dispatch) => {
  const unmappedFilesCheck = useIndexdAuthz ? 'authz=null' : 'acl=null';
  return fetchWithCreds({
    path: `${indexdPath}index?${unmappedFilesCheck}&uploader=${user}&start=${start}&limit=${FETCH_LIMIT}`,
    method: 'GET',
  })
    .then(
      ({ status, data }) => {
        switch (status) {
          case 200:
            total = total.concat(data.records ?? []);
            if (data.records?.length === FETCH_LIMIT) {
              return dispatch(
                fetchUnmappedFiles(
                  user,
                  total,
                  data.records[FETCH_LIMIT - 1].did
                )
              );
            }
            return {
              type: 'RECEIVE_UNMAPPED_FILES',
              data: total,
            };
          default:
            return {
              type: 'FETCH_ERROR',
              error: data.records,
            };
        }
      },
      (err) => ({ type: 'FETCH_ERROR', error: err })
    )
    .then((msg) => {
      if (msg) dispatch(msg);
    });
};

const mapSelectedFiles = (files) => ({
  type: 'RECEIVE_FILES_TO_MAP',
  data: files,
});

const ReduxMapFiles = (() => {
  const mapStateToProps = (state) => ({
    unmappedFiles: state.submission.unmappedFiles,
    user: state.user,
  });

  const mapDispatchToProps = (dispatch) => ({
    fetchUnmappedFiles: (user) =>
      dispatch(fetchUnmappedFiles(user, [], STARTING_DID)),
    mapSelectedFiles: (files) => dispatch(mapSelectedFiles(files)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(MapFiles);
})();

export default ReduxMapFiles;
