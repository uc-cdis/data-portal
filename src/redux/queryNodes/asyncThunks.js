import { createAsyncThunk } from '@reduxjs/toolkit';
import { submissionApiPath } from '../../localconf';
import { getSubmitPath } from '../../utils';
import { fetchWithCreds } from '../../utils.fetch';
import { updatePopup } from '../popups/slice';
import { requestErrored } from '../status/slice';

export const deleteNode = createAsyncThunk(
  'queryNode/deleteNode',
  /** @param {{ id: string;  project: string }} args */
  async ({ id, project }, { dispatch, rejectWithValue }) => {
    const { data, status } = await fetchWithCreds({
      path: `${getSubmitPath(project)}/entities/${id}`,
      method: 'DELETE',
      onError: () => dispatch(requestErrored()),
    });
    // console.log('receive delete');
    dispatch(updatePopup({ nodedelete_popup: false, view_popup: false }));

    if (status !== 200) return rejectWithValue(data);
    return id;
  }
);

export const fetchQueryNode = createAsyncThunk(
  'queryNode/fetchQueryNode',
  /** @param {{ id: string;  project: string }} args */
  async ({ id, project }, { dispatch }) => {
    const { data, status } = await fetchWithCreds({
      path: `${getSubmitPath(project)}/export?ids=${id}&format=json`,
      onError: () => dispatch(requestErrored()),
    });

    if (status !== 200) return null;
    return data[0];
  }
);

export const submitSearchForm = createAsyncThunk(
  'queryNodes/submitSearchForm',
  /**
   * @param {Object} opts
   * @param {() => void} [opts.callback]
   * @param {string} opts.node_type
   * @param {string} opts.project
   * @param {string} opts.submitter_id
   */
  async (opts, { dispatch }) => {
    const nodeType = opts.node_type;
    const submitterId = opts.submitter_id || '';

    const { data, status } = await fetchWithCreds({
      path: `${submissionApiPath}graphql`,
      body: JSON.stringify({
        query: `query Test { ${nodeType} (first: 20, project_id: "${opts.project}", quick_search: "${submitterId}", order_by_desc: "updated_datetime") {id, type, submitter_id}}`,
      }),
      method: 'POST',
      onError: () => dispatch(requestErrored()),
    });

    const payload = {
      search_result: data,
      search_status:
        status === 200 ? `succeed: ${status}` : `failed: ${status}`,
    };

    opts.callback?.();
    return payload;
  }
);
