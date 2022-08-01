import { createAsyncThunk } from '@reduxjs/toolkit';
import { submissionApiPath } from '../../localconf';
import { fetchWithCreds } from '../../utils.fetch';
import { fetchUserErrored } from '../user/slice';

const PROJECTS_QUERY =
  'query { project(first:0) { code, project_id, availability_type } }';

export const fetchProjects = createAsyncThunk(
  'project/fetchProjects',
  async (_, { dispatch, getState }) => {
    const state = /** @type {import('../types').RootState} */ (getState());
    if (state.project.projects) return null;

    const { data, status } = await fetchWithCreds({
      path: `${submissionApiPath}graphql`,
      body: JSON.stringify({ query: PROJECTS_QUERY }),
      method: 'POST',
    });

    if (status !== 200) {
      dispatch(fetchUserErrored(data));
      return null;
    }

    return data.data.project;
  }
);
