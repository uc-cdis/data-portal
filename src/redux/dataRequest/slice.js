import { createSlice } from '@reduxjs/toolkit';
import {
  fetchProjects,
  createProject,
  fetchProjectStates,
  getProjectUsers,
  getUserRoles,
  deleteProjectUser,
  getProjectFilterSets,
  addFiltersetToRequest,
} from './asyncThunks';

const slice = createSlice({
  name: 'dataRequest',
  initialState: /** @type {import("./types").DataRequestState} */ ({
    projects: [],
    projectUsers: [],
    userRoles: [],
    projectStates: {},
    projectFilterSets: [],
    isError: false,
    isAdminActive: false,
    isProjectsReloading: false,
    isCreatePending: false,
    isUserRolesPending: false,
  }),
  reducers: {
    toggleAdminActive(state) {
      state.isAdminActive = !state.isAdminActive;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProjects.pending, (state, action) => {
      if (action.meta.arg.triggerReloading) {
        state.isProjectsReloading = true;
      }
    });
    builder.addCase(fetchProjects.fulfilled, (state, action) => {
      state.isProjectsReloading = false;
      if (action.payload === null) return;

      state.projects = action.payload;
    });
    builder.addCase(fetchProjects.rejected, (state) => {
      state.isProjectsReloading = false;
      state.isError = true;
    });
    builder.addCase(fetchProjectStates.fulfilled, (state, action) => {
      if (
        action.payload === null ||
        Object.keys(state.projectStates).length > 0
      )
        return;

      const { projectStates } = state;

      for (const projectState of action.payload) {
        state.projectStates[projectState.name] = {
          id: projectState.id,
          code: projectState.code,
        };
      }

      state.projectStates = projectStates;
    });
    builder.addCase(createProject.pending, (state) => {
      state.isCreatePending = true;
    });
    builder.addCase(createProject.fulfilled, (state, action) => {
      state.isCreatePending = false;

      if (action.payload === null) return;

      const {
        meta: {
          user_id: currentUserId,
          additional_info: { firstName, lastName, institution },
        },
        data: { id, name, create_date: submitted_at },
      } = action.payload;

      const newProject = {
        completed_at: '',
        has_access: false,
        id,
        name,
        researcher: {
          first_name: firstName,
          last_name: lastName,
          institution,
          id: currentUserId,
        },
        /** @type {"In Review"} */
        status: 'In Review',
        submitted_at,
        consortia: [],
      };

      state.projects = [newProject, ...state.projects];
    });
    builder.addCase(createProject.rejected, (state) => {
      state.isCreatePending = false;
      state.isError = true;
    });
    builder.addCase(getProjectUsers.pending, (state) => {
      state.isProjectUsersPending = true;
    });
    builder.addCase(getProjectUsers.rejected, (state) => {
      state.isProjectUsersPending = false;
      state.isError = true;
    });
    builder.addCase(getProjectUsers.fulfilled, (state, action) => {
      state.isProjectUsersPending = false;
      if (action.payload) {
        state.projectUsers = action.payload;
      }
    });
    builder.addCase(getUserRoles.pending, (state) => {
      state.isUserRolesPending = true;
    });
    builder.addCase(getUserRoles.rejected, (state) => {
      state.isUserRolesPending = false;
      state.isError = true;
    });
    builder.addCase(getUserRoles.fulfilled, (state, action) => {
      state.isUserRolesPending = false;
      if (action.payload) {
        state.userRoles = action.payload;
      }
    });
    builder.addCase(getProjectFilterSets.rejected, (state) => {
      state.isError = true;
    });
    builder.addCase(getProjectFilterSets.fulfilled, (state, action) => {
      if (action.payload) {
        state.projectFilterSets = action.payload.data;
        state.isError = false;
      }
    });
    builder.addCase(addFiltersetToRequest.rejected, (state) => {
      state.isError = true;
    });
  },
});

export const { toggleAdminActive } = slice.actions;
export default slice.reducer;
