import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchWithCreds } from '../../utils.fetch';

export const fetchProjects = createAsyncThunk(
  'dataRequest/fetchProjects',
  async (_, { getState, rejectWithValue }) => {
    const { dataRequest: { isAdminActive } } = /** @type {import('../types').RootState} */ (getState());

    try {
        const { data, response, status } = await fetchWithCreds({
            path: isAdminActive ? '/amanuensis/projects?special_user=admin' : '/amanuensis/projects',
            method: 'GET',
        });
      
        if (status !== 200) {
        console.error(`WARNING: failed to with status ${response.statusText}`);
        return null;
        }
      
        return data;
      } catch (e) {
        return rejectWithValue(e);
      }
  }
);

export const createProject = createAsyncThunk(
    'dataRequest/createProject',
    /** @param {import('./types').CreateParams} createParams */
    async (createParams, { getState, rejectWithValue }) => {  
      try {
          const { data, response, status } = await fetchWithCreds({
              path: '/amanuensis/admin/projects',
              method: 'POST',
              body: JSON.stringify(createParams)
          });
        
          if (status !== 200) {
            console.error(`WARNING: failed to with status ${response.statusText}`);
            return null;
          }
        
          return data;
        } catch (e) {
          return rejectWithValue(e);
        }
    }
  );
  