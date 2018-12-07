import { connect } from 'react-redux';
import MapFiles from './MapFiles';
import { fetchWithCreds } from '../actions';
import { indexdPath } from '../localconf';

const mockData = {
  records: [
    {
      acl: ['QA', 'test'],
      baseid: 'a388afc5-eb87-47e3',
      created_date: '2018-09-11T20:01:20.055349',
      did: '00041e7a-3114-4d9f-8003',
      file_name: 'File 1',
      form: 'object',
      hashes: { md5: 'd8c905a8430d2e73' },
      metadata: {},
      rev: '8d35',
      size: 5,
      updated_date: '2018-09-11T20:01:20.055358',
      urls: [],
      urls_metadata: {},
      version: null,
    }, {
      acl: ['DEV', 'test'],
      baseid: '82116315-8a8e-44b2-8b11',
      created_date: '2018-09-11T20:01:20.055349',
      did: '0015f105-3292-4530-8d74',
      file_name: 'File 2',
      form: 'object',
      hashes: { md5: '6b003296d8a' },
      metadata: {},
      rev: '6a',
      size: 6,
      updated_date: '2018-08-16T21:15:40.465790',
      urls: [],
      urls_metadata: {},
      version: null,
    }, {
      acl: ['DEV', 'test'],
      baseid: '183f568a-7ab9-4ffa',
      created_date: '2018-08-16T20:11:38.322176',
      did: '0156d02a-2a58-4479112',
      file_name: 'File 3',
      form: 'object',
      hashes: null,
      metadata: {},
      rev: '20ab',
      size: 16,
      updated_date: '2018-08-16T20:11:38.322186',
      urls: [],
      urls_metadata: {},
      version: null,
    },
    {
      acl: ['DEV', 'test'],
      baseid: '183f568a-7ab9-4ffa',
      created_date: '2018-08-16T20:11:38.322176',
      did: '0156d02a-2a58-4479567',
      file_name: 'File 4',
      form: 'object',
      hashes: { md5: '9616a77e' },
      metadata: {},
      rev: '20ab',
      size: 8,
      updated_date: '2018-08-16T20:11:38.322186',
      urls: [],
      urls_metadata: {},
      version: null,
    },
    {
      acl: ['DEV', 'test'],
      baseid: '183f568a-7ab9-4ffa',
      created_date: '2018-08-16T20:11:38.322176',
      did: '0156d02a-2a58-4479890',
      file_name: 'File 5',
      form: 'object',
      hashes: null,
      metadata: {},
      rev: '20ab',
      size: 51,
      updated_date: '2018-08-18T20:11:38.322186',
      urls: [],
      urls_metadata: {},
      version: null,
    },
    {
      acl: ['QA', 'test'],
      baseid: 'a388afc5-eb87-47e3',
      created_date: '2018-09-11T22:50:20.055349',
      did: '00041e7a-3114-4d9f-800344',
      file_name: 'File 6',
      form: 'object',
      hashes: { md5: 'd8c905a8430d2e73' },
      metadata: {},
      rev: '8d35',
      size: 5,
      updated_date: '2018-09-11T22:50:20.055358',
      urls: [],
      urls_metadata: {},
      version: null,
    },
  ],
};

// TODO: Remove mock data
const fetchUnmappedFiles = () => dispatch => fetchWithCreds({
  path: `${indexdPath}index?acl=null`,
  method: 'GET',
}).then(
  ({ status, data }) => {
    switch (status) {
    case 200:
      return {
        type: 'RECEIVE_UNMAPPED_FILES',
        data: mockData.records,
      };
    default:
      return {
        type: 'FETCH_ERROR',
        error: mockData.records,
      };
    }
  },
  err => ({ type: 'FETCH_ERROR', error: err }),
).then((msg) => { dispatch(msg); });

const mapSelectedFiles = files => ({
  type: 'RECEIVE_FILES_TO_MAP',
  data: files,
});

const ReduxMapFiles = (() => {
  const mapStateToProps = state => ({
    unmappedFiles: state.submission.unmappedFiles,
  });

  const mapDispatchToProps = dispatch => ({
    fetchUnmappedFiles: () => dispatch(fetchUnmappedFiles()),
    mapSelectedFiles: files => dispatch(mapSelectedFiles(files)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(MapFiles);
})();

export default ReduxMapFiles;
