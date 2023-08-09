import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchWithCreds } from '../../utils.fetch';

export const fetchProjects = createAsyncThunk(
  'dataRequest/fetchProjects',
  /** @param {{ triggerReloading: boolean  }} _ */
  async ({ triggerReloading } = { triggerReloading: false }, { getState, rejectWithValue }) => {
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

export const fetchProjectStates = createAsyncThunk(
  'dataRequest/fetchProjectStates',
  async (_, { getState, rejectWithValue }) => {
    const { dataRequest: { projectStates } } = /** @type {import('../types').RootState} */ (getState());

    if (Object.keys(projectStates).length > 0) return;
    
    try {
        const { data, response, status } = await fetchWithCreds({
          path: '/amanuensis/admin/states',
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
              path: createParams.isAdmin ? '/amanuensis/admin/projects' : '/amanuensis/projects',
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

  export const updateProjectState = createAsyncThunk(
    'dataRequest/updateProjectState',
    /** @param {import('./types').ProjectStateUpdateParams} updateParams */
    async (updateParams, { getState, rejectWithValue }) => {  
      try {
          const { data, response, status } = await fetchWithCreds({
              path: '/amanuensis/admin/projects/state',
              method: 'POST',
              body: JSON.stringify(updateParams)
          });
        
          if (statusCategory(status) !== '2XX') {
            switch (statusCategory(status)) {
              case '5XX':
                return {
                  isError: true,
                  message: 'Oops! An issue occured on our end, please try again',
                  data: null,
                };
              case '4XX':
                return {
                  isError: true,
                  message: 'Oop! We were unable to process your request, make sure you have the right permissions',
                  data: null,
                }
            }
            console.error(`WARNING: failed to with status ${response.statusText}`);
            return {
              isError: true,
              message: 'An unknown error occured',
              data: null,
            };
          }
          return { data, isError: false, message: '' };
        } catch (e) {
          return rejectWithValue(e);
        }
    }
  );

  export const updateProjectUsers = createAsyncThunk(
    'dataRequest/updateProjectUsers',
    /** @param {import('./types').ProjectUsersUpdateParams} updateParams */
    async (updateParams, { getState, rejectWithValue }) => {  
      try {
          const { data, response, status } = await fetchWithCreds({
              path: '/amanuensis/admin/associated_user',
              method: 'POST',
              body: JSON.stringify(updateParams)
          });
        
          if (statusCategory(status) !== '2XX') {
            switch (statusCategory(status)) {
              case '5XX':
                return {
                  isError: true,
                  message: 'Oops! An issue occured on our end, please try again',
                  data: null,
                };
              case '4XX':
                return {
                  isError: true,
                  message: 'Oop! We were unable to process your request, make sure you have the right permissions',
                  data: null,
                }
            }
            console.error(`WARNING: failed to with status ${response.statusText}`);
            return {
              isError: true,
              message: 'An unknown error occured',
              data: null,
            };
          }
          return { data, isError: false, message: '' };
        } catch (e) {
          return rejectWithValue(e);
        }
    }
  );

  export const updateProjectApprovedUrl = createAsyncThunk(
    'dataRequest/updateProjectApprovedUrl',
    /** @param {import('./types').ProjectUrlUpdateParams} updateParams */
    async (updateParams, { getState, rejectWithValue }) => {  
      try {
          const { data, response, status } = await fetchWithCreds({
              path: '/amanuensis/admin/projects',
              method: 'PUT',
              body: JSON.stringify(updateParams)
          });
        
          if (statusCategory(status) !== '2XX') {
            switch (statusCategory(status)) {
              case '5XX':
                return {
                  isError: true,
                  message: 'Oops! An issue occured on our end, please try again',
                  data: null,
                };
              case '4XX':
                return {
                  isError: true,
                  message: 'Oop! We were unable to process your request, make sure you have the right permissions',
                  data: null,
                }
            }
            console.error(`WARNING: failed to with status ${response.statusText}`);
            return {
              isError: true,
              message: 'An unknown error occured',
              data: null,
            };
          }
          return { data, isError: false, message: '' };
        } catch (e) {
          return rejectWithValue(e);
        }
    }
  );

  export const updateUserDataAccess = createAsyncThunk(
    'dataRequest/updateUserDataAccess',
    /** @param {import('./types').UserRoleUpdateParams} updateParams */
    async (updateParams, { getState, rejectWithValue }) => {  
      try {
          const { data, response, status } = await fetchWithCreds({
              path: '/amanuensis/admin/associated_user_role',
              method: 'PUT',
              body: JSON.stringify(updateParams)
          });
        
          if (statusCategory(status) !== '2XX') {
            switch (statusCategory(status)) {
              case '5XX':
                return {
                  isError: true,
                  message: 'Oops! An issue occured on our end, please try again',
                  data: null,
                };
              case '4XX':
                return {
                  isError: true,
                  message: 'Oop! We were unable to process your request, make sure you have the right permissions',
                  data: null,
                }
            }
            console.error(`WARNING: failed to with status ${response.statusText}`);
            return {
              isError: true,
              message: 'An unknown error occured',
              data: null,
            };
          }
          return { data, isError: false, message: '' };
        } catch (e) {
          return rejectWithValue(e);
        }
    }
  );