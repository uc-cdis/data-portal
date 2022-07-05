import { createAsyncThunk } from '@reduxjs/toolkit';
import { indexdPath, submissionApiPath, useIndexdAuthz } from '../../localconf';
import { buildCountsQuery } from '../../Submission/utils';
import { fetchWithCreds } from '../../utils.fetch';
import { requestErrored } from '../status/slice';
import { fetchUserErrored } from '../user/slice';

/** @typedef {import('../types').RootState} RootState */

const FETCH_LIMIT = 1024;

export const fetchCounts = createAsyncThunk(
  'submission/fetchCounts',
  /** @param {string} project */
  async (project, { dispatch, getState, rejectWithValue }) => {
    const state = /** @type {RootState} */ (getState());
    const { dictionary, nodeTypes } = state.submission;

    try {
      const { status, data } = await fetchWithCreds({
        path: `${submissionApiPath}graphql`,
        body: JSON.stringify({
          query: buildCountsQuery(dictionary, nodeTypes, project),
        }),
        method: 'POST',
        onError: () => dispatch(requestErrored()),
      });

      if (status !== 200) throw data.data;
      return data.data;
    } catch (e) {
      dispatch(fetchUserErrored(e));
      return rejectWithValue();
    }
  }
);

export const fetchDictionary = createAsyncThunk(
  'submission/fetchDictionary',
  async (_, { getState }) => {
    const state = /** @type {RootState} */ (getState());
    if (state.submission.dictionary) return undefined;

    return (await import('../../../data/dictionary.json')).default;
  }
);

export const fetchUnmappedFiles = createAsyncThunk(
  'submission/fetchUnmappedFiles',
  /**
   * @param {Object} args
   * @param {string} args.start
   * @param {RootState['submission']['unmappedFiles']} args.total
   * @param {import('../user/types').UserState['username']} args.username
   */
  async ({ start, total, username }, { dispatch }) => {
    const unmappedFilesCheck = useIndexdAuthz ? 'authz=null' : 'acl=null';
    try {
      const { data, status } = await fetchWithCreds({
        path: `${indexdPath}index?${unmappedFilesCheck}&uploader=${username}&start=${start}&limit=${FETCH_LIMIT}`,
        method: 'GET',
      });
      const files = total.concat(data.records ?? []);
      if (status !== 200) throw data.records;

      if (data.records?.length === FETCH_LIMIT)
        dispatch(
          fetchUnmappedFiles({
            start: data.records[FETCH_LIMIT - 1].did,
            total: files,
            username,
          })
        );

      return files;
    } catch (e) {
      dispatch(fetchUserErrored(e));
      return undefined;
    }
  }
);

export const fetchUnmappedFileStats = createAsyncThunk(
  'submission/fetchUnmappedFileStats',
  /**
   * @param {Object} args
   * @param {string} args.start
   * @param {RootState['submission']['unmappedFiles']} args.total
   * @param {import('../user/types').UserState['username']} args.username
   */
  async ({ start, total, username }, { dispatch }) => {
    const unmappedFilesCheck = useIndexdAuthz ? 'authz=null' : 'acl=null';
    try {
      const { data, status } = await fetchWithCreds({
        path: `${indexdPath}index?${unmappedFilesCheck}&uploader=${username}&start=${start}&limit=${FETCH_LIMIT}`,
        method: 'GET',
      });

      const files = total.concat(data.records ?? []);
      if (status !== 200) throw data.records;

      if (data.records?.length === FETCH_LIMIT)
        dispatch(
          fetchUnmappedFileStats({
            start: data.records[FETCH_LIMIT - 1].did,
            total: files,
            username,
          })
        );

      let size = 0;
      for (const f of files) size += f.size;

      return { count: files.length, size };
    } catch (e) {
      dispatch(fetchUserErrored(e));
      return undefined;
    }
  }
);

export const submitFileChunk = createAsyncThunk(
  'submission/submitFileChunk',
  /**
   * @param {Object} args
   * @param {string} args.fileChunk
   * @param {number} args.fileChunkTotal
   * @param {string} args.fileType
   * @param {string} args.fullProject
   */
  async (args, { dispatch }) => {
    const { fileChunk, fileChunkTotal, fileType, fullProject } = args;
    const [program, ...rest] = fullProject.split('-');
    const path =
      program === '_root'
        ? submissionApiPath
        : `${submissionApiPath + program}/${rest.join('-')}/`;
    const method = /* fullProject === 'graphql' ? 'POST' : */ 'PUT';

    const { data, status } = await fetchWithCreds({
      path,
      method,
      customHeaders: new Headers({ 'Content-Type': fileType }),
      body: fileChunk,
      onError: () => dispatch(requestErrored()),
    });

    return { data, status, total: fileChunkTotal };
  }
);
