import { createSlice } from '@reduxjs/toolkit';
import { getFileNodes, getNodeTypes } from '../../graphutils';
import { components } from '../../params';
import { getDictionaryWithExcludeSystemProperties } from '../../Submission/utils';
import { predictFileType } from '../../utils';
import {
  fetchCounts,
  fetchDictionary,
  fetchUnmappedFiles,
  fetchUnmappedFileStats,
  submitFileChunk,
} from './asyncThunks';
import { parseCounts, parseSubmitResponse } from './utils';

/**
 * @template T
 * @typedef {import('@reduxjs/toolkit').PayloadAction<T>} PayloadAction
 */
/** @typedef {import('./types').SubmissionState} SubmissionState */

const slice = createSlice({
  name: 'submission',
  initialState: /** @type {SubmissionState} */ ({}),
  reducers: {
    clearCounts(state) {
      state.counts_search = null;
      state.links_search = null;
    },
    /** @param {PayloadAction<SubmissionState['filesToMap']>} action */
    receiveFilesToMap(state, action) {
      state.filesToMap = action.payload;
    },
    /** @param {PayloadAction<any>} action */
    receiveProjectDetail(state, action) {
      const projectsByName = {
        ...(state.projectsByName ?? {}),
        [action.payload.name]: action.payload,
      };

      state.lastestDetailsUpdating = Date.now();
      state.projectsByName = projectsByName;
    },
    /**
     * @typedef {Object} ReceiveProjectListPayload
     * @property {Object[]} projectList
     * @property {SubmissionState['summaryCounts']} payload.summaryCounts
     */
    /** @param {PayloadAction<ReceiveProjectListPayload>} action */
    receiveProjectList(state, action) {
      // save projectsByName, b/c we acquire more data for individual tables over time
      const projectsByName = { ...(state.projectsByName ?? {}) };
      for (const p of action.payload.projectList)
        projectsByName[p.name] = { ...(projectsByName[p.name] ?? {}), ...p };

      const summaryCounts = {
        ...(state.summaryCounts ?? {}),
        ...action.payload.summaryCounts,
      };

      state.countNames = components.charts.indexChartNames;
      state.lastestListUpdating = Date.now();
      state.projectsByName = projectsByName;
      state.summaryCounts = summaryCounts;
    },
    /** @param {PayloadAction<SubmissionState['error']>} action */
    receiveRelayFail(state, action) {
      state.error = action.payload;
    },
    /** @param {PayloadAction<Pick<SubmissionState, 'search_result' | 'search_status'>>} action */
    receiveSearchEntities(state, action) {
      state.search_result = action.payload.search_result;
      state.search_status = action.payload.search_status;
    },
    /** @param {PayloadAction<SubmissionState['transactions']>} action */
    receiveTransactionList(state, action) {
      state.transactions = action.payload;
    },
    /** @param {PayloadAction<Pick<SubmissionState, 'file' | 'file_type'>>} action */
    requestUpload(state, action) {
      state.file = action.payload.file;
      state.file_type = action.payload.file_type;
    },
    resetSubmissionStatus(state) {
      state.submit_entity_counts = {};
      state.submit_result = null;
      state.submit_result_string = '';
      state.submit_status = 0;
      state.submit_counter = 0;
      state.submit_total = 0;
    },
    /** @param {PayloadAction<SubmissionState['search_form']>} action */
    submitSearchForm(state, action) {
      state.search_form = action.payload;
    },
    /** @param {PayloadAction<Pick<SubmissionState, 'file' | 'file_type'>>} action */
    updateFile(state, action) {
      const { file, file_type: fileType } = action.payload;

      state.file = file;
      state.file_type = predictFileType(file, fileType);
    },
    /** @param {PayloadAction<SubmissionState['formSchema']>} action */
    updateFormSchema(state, action) {
      state.formSchema = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDictionary.fulfilled, (state, action) => {
        const dictionary = action.payload;
        if (dictionary === undefined) return;

        state.dictionary = getDictionaryWithExcludeSystemProperties(dictionary);
        state.nodeTypes = getNodeTypes(dictionary);
        state.file_nodes = getFileNodes(dictionary);
      })
      .addCase(fetchUnmappedFiles.fulfilled, (state, action) => {
        state.unmappedFiles = action.payload;
      })
      .addCase(fetchUnmappedFileStats.fulfilled, (state, action) => {
        state.unmappedFileCount = action.payload.count;
        state.unmappedFileSize = action.payload.size;
      })
      .addCase(fetchCounts.fulfilled, (state, action) => {
        const { countsSearch, linksSearch } = parseCounts(action.payload);

        state.counts_search = countsSearch;
        state.links_search = linksSearch;
      })
      .addCase(submitFileChunk.fulfilled, (state, action) => {
        const { total, ...response } = action.payload;
        const { entityCounts, result, resultString, status } =
          parseSubmitResponse(state, response);

        state.submit_counter += 1;
        state.submit_entity_counts = entityCounts;
        state.submit_result = result;
        state.submit_result_string += resultString;
        state.submit_status = status;
        state.submit_total = total;
      });
  },
});

export const {
  clearCounts,
  receiveFilesToMap,
  receiveProjectDetail,
  receiveProjectList,
  receiveRelayFail,
  receiveSearchEntities,
  receiveTransactionList,
  requestUpload,
  resetSubmissionStatus,
  submitSearchForm,
  updateFile,
  updateFormSchema,
} = slice.actions;

export default slice.reducer;
