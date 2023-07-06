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

function statusCategory(status) {
  return `${Math.floor(status / 100)}XX`;
}


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
        
          if (statusCategory(status) !== '2XX') {
            switch (statusCategory(status)) {
              case '5XX':
                return {
                  isError: true,
                  message: 'Oops! An issue occured on our end, please try again',
                  data: null,
                  meta: null
                };
              case '4XX':
                return {
                  isError: true,
                  message: 'Oop! We were unable to process your request, make sure you have the right permissions',
                  data: null,
                  meta: null
                }
            }
            console.error(`WARNING: failed to with status ${response.statusText}`);
            return {
              isError: true,
              message: 'An unknown error occured',
              data: null,
              meta: null
            };
          }

          let { 
            user: {
              user_id,
              additional_info
            } 
          } = /** @type {import('../types').RootState} */ (getState());;
          let meta = {
            user_id,
            additional_info
          };
        
          return { data, meta, isError: false, message: '' };
        } catch (e) {
          return rejectWithValue(e);
        }
    }
  );
  