import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchWithCreds } from '../../utils.fetch';

function statusCategory(status) {
  return `${Math.floor(status / 100)}XX`;
}

function handleRequestError(status, response) {
  switch (statusCategory(status)) {
    case '5XX':
      return {
        isError: true,
        message: 'Oops! An issue occurred on our end, please try again',
        data: null,
      };
    case '4XX':
      return {
        isError: true,
        message:
          'We were unable to process your request; make sure you have the right permissions',
        data: null,
      };
    default:
      console.error(
        `WARNING: Request failed with status ${response.statusText}`,
      );
      return {
        isError: true,
        message: 'An unknown error occurred',
        data: null,
      };
  }
}

export const fetchProjects = createAsyncThunk(
  'dataRequest/fetchProjects',
  /** @param {{ triggerReloading: boolean  }} _ */
  async (
    { triggerReloading } = { triggerReloading: false },
    { getState, rejectWithValue },
  ) => {
    const {
      dataRequest: { isAdminActive },
    } = /** @type {import("../types").RootState} */ (getState());

    try {
      const { data, response, status } = await fetchWithCreds({
        path: isAdminActive
          ? '/amanuensis/projects?special_user=admin'
          : '/amanuensis/projects',
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
  },
);

export const fetchProjectStates = createAsyncThunk(
  'dataRequest/fetchProjectStates',
  async (_, { getState, rejectWithValue }) => {
    const {
      dataRequest: { projectStates },
    } = /** @type {import("../types").RootState} */ (getState());

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
  },
);

export const createProject = createAsyncThunk(
  'dataRequest/createProject',
  /** @param {import("./types").CreateParams} createParams */
  async (createParams, { getState, rejectWithValue }) => {
    const createBody = {
      user_id: createParams.user_id,
      name: createParams.name,
      description: createParams.description,
      institution: createParams.institution,
      associated_users_emails: createParams.associated_users_emails,
      filter_set_ids: createParams.filter_set_ids,
    };
    try {
      const { data, response, status } = await fetchWithCreds({
        path: createParams.isAdmin
          ? '/amanuensis/admin/projects'
          : '/amanuensis/projects',
        method: 'POST',
        body: JSON.stringify(createBody),
      });

      if (statusCategory(status) !== '2XX') {
        return handleRequestError(status, response);
      }

      const {
        user: { user_id, additional_info },
      } = /** @type {import("../types").RootState} */ (getState());
      const meta = {
        user_id,
        additional_info,
      };

      return { data, meta, isError: false, message: '' };
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);

export const updateProjectState = createAsyncThunk(
  'dataRequest/updateProjectState',
  /** @param {import("./types").ProjectStateUpdateParams} updateParams */
  async (updateParams, { rejectWithValue }) => {
    try {
      const { data, response, status } = await fetchWithCreds({
        path: '/amanuensis/admin/projects/state',
        method: 'POST',
        body: JSON.stringify(updateParams),
      });

      if (statusCategory(status) !== '2XX') {
        return handleRequestError(status, response);
      }
      return { data, isError: false, message: '' };
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);

export const updateProjectUsers = createAsyncThunk(
  'dataRequest/updateProjectUsers',
  /** @param {import("./types").ProjectUsersUpdateParams} updateParams */
  async (updateParams, { rejectWithValue }) => {
    try {
      const { data, response, status } = await fetchWithCreds({
        path: '/amanuensis/admin/associated_user',
        method: 'POST',
        body: JSON.stringify(updateParams),
      });

      if (statusCategory(status) !== '2XX') {
        return handleRequestError(status, response);
      }
      return { data, isError: false, message: '' };
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);

export const updateProjectApprovedUrl = createAsyncThunk(
  'dataRequest/updateProjectApprovedUrl',
  /** @param {import("./types").ProjectUrlUpdateParams} updateParams */
  async (updateParams, { rejectWithValue }) => {
    try {
      const { data, response, status } = await fetchWithCreds({
        path: '/amanuensis/admin/projects',
        method: 'PUT',
        body: JSON.stringify(updateParams),
      });

      if (statusCategory(status) !== '2XX') {
        handleRequestError(status, response);
      }
      return { data, isError: false, message: '' };
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);

export const updateUserDataAccess = createAsyncThunk(
  'dataRequest/updateUserDataAccess',
  /** @param {import("./types").UserRoleUpdateParams} updateParams */
  async (updateParams, { rejectWithValue }) => {
    try {
      const { data, response, status } = await fetchWithCreds({
        path: '/amanuensis/admin/associated_user_role',
        method: 'PUT',
        body: JSON.stringify(updateParams),
      });

      if (statusCategory(status) !== '2XX') {
        return handleRequestError(status, response);
      }
      return { data, isError: false, message: '' };
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);

export const addFiltersetToRequest = createAsyncThunk(
  'dataRequest/addFiltersetToRequest',
  /** @param {import("./types").AddFilterSetIdUpdateParams} updateParams */
  async (updateParams, { rejectWithValue }) => {
    try {
      const { data, response, status } = await fetchWithCreds({
        path: '/amanuensis/admin/copy-search-to-project',
        method: 'POST',
        body: JSON.stringify(updateParams),
      });

      if (statusCategory(status) !== '2XX') {
        return handleRequestError(status, response);
      }
      return { data, isError: false, message: '', status: status };
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);

export const deleteRequest = createAsyncThunk(
  'dataRequest/deleteRequest',
  /** @param {import("./types").DeleteRequestParams} deleteParams */
  async (deleteParams, { rejectWithValue }) => {
    try {
      const { data, response, status } = await fetchWithCreds({
        path: '/amanuensis/admin/delete-project',
        method: 'DELETE',
        body: JSON.stringify(deleteParams),
      });
      if (statusCategory(status) !== '2XX') {
        return handleRequestError(status, response);
      }
      return { data, isError: false, message: '' };
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);

export const deleteProjectUser = createAsyncThunk(
  'dataRequest/deleteProjectUser',
  /** @param {import("./types").DeleteUserParams} deleteParams */
  async (deleteParams, { rejectWithValue }) => {
    try {
      const { data, response, status } = await fetchWithCreds({
        path: '/amanuensis/admin/remove_associated_user_from_project',
        method: 'DELETE',
        body: JSON.stringify(deleteParams),
      });
      if (statusCategory(status) !== '2XX') {
        return handleRequestError(status, response);
      }
      return { data, isError: false, message: '' };
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);

export const getProjectUsers = createAsyncThunk(
  'dataRequest/getProjectUsers',
  /** @param {string} projectId */
  async (projectId, { rejectWithValue }) => {
    try {
      const { data, response, status } = await fetchWithCreds({
        path: `/amanuensis/admin/project_users/${projectId}`,
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
  },
);

export const getUserRoles = createAsyncThunk(
  'dataRequest/getUserRoles',
  async (_, { rejectWithValue }) => {
    try {
      const { data, response, status } = await fetchWithCreds({
        path: '/amanuensis/admin/all_associated_user_roles',
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
  },
);

export const getProjectFilterSets = createAsyncThunk(
  'dataRequest/getProjectFilterSets',
  /** @param {string} projectId */
  async (projectId, { rejectWithValue }) => {
    try {
      const { data, response, status } = await fetchWithCreds({
        path: `/amanuensis/admin/project_filter_sets/${projectId}`,
        method: 'GET',
      });

      if (statusCategory(status) !== '2XX') {
        return {data: [], isError: true, message: 'Failed to fetch filter sets', status: status}
      }
      return { data, isError: false, message: '', status: status };;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);
