import { createSlice } from '@reduxjs/toolkit';
import { fetchProjects, createProject, fetchProjectStates } from './asyncThunks';

const slice = createSlice({
  name: 'dataRequest',
  initialState: /** @type {import('./types').DataRequestState} */ ({
    projects: [],
    projectStates: {},
    isError: false,
    isAdminActive: false,
    isProjectsReloading: false,
    isCreatePending: false,
  }),
  reducers: {
    toggleAdminActive(state) {
      state.isAdminActive = !state.isAdminActive;
    }
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
      if (action.payload === null || Object.keys(state.projectStates).length > 0) return;

      let projectStates = state.projectStates;

      for (let projectState of action.payload) {
        state.projectStates[projectState.name] = { id: projectState.id, code: projectState.code };
      }

      state.projectStates = projectStates;
    });
    builder.addCase(createProject.pending, (state) => {  
      state.isCreatePending = true;
    });
    builder.addCase(createProject.fulfilled, (state, action) => {        
        state.isCreatePending = false;
       
        if (action.payload === null) return;

        let {
          meta: {
            user_id: currentUserId,
            additional_info: {
              firstName,
              lastName,
              institution
            }
          },
          data: {
            id,
            name,
            create_date: submitted_at,
          }
        } = action.payload;

        let newProject = {
            completed_at: "",
            has_access: false,
            id,
            name,
            researcher: {
                first_name: firstName,
                last_name: lastName,
                institution,
                id: currentUserId
            },
            /** @type {'In Review'} */
            status: 'In Review',
            submitted_at,
            consortia: []
        };

        state.projects = [newProject, ...state.projects];
    });
    builder.addCase(createProject.rejected, (state) => {  
        state.isCreatePending = false;
        state.isError = true;
    });
  },
});

export const { toggleAdminActive } = slice.actions;
export default slice.reducer;
