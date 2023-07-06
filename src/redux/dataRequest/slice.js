import { createSlice } from '@reduxjs/toolkit';
import { fetchProjects, createProject } from './asyncThunks';

const slice = createSlice({
  name: 'dataRequest',
  initialState: /** @type {import('./types').DataRequestState} */ ({
    projects: [],
    isError: false,
    isAdminActive: false,
    isProjectsLoading: false,
    isCreatePending: false,
  }),
  reducers: {
    toggleAdminActive(state) {
      state.isAdminActive = !state.isAdminActive;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProjects.pending, (state) => {
      state.isProjectsLoading = true;
    });
    builder.addCase(fetchProjects.fulfilled, (state, action) => {
      state.isProjectsLoading = false;
      if (action.payload === null) return;

      state.projects = action.payload;
    });
    builder.addCase(fetchProjects.rejected, (state) => {  
      state.isProjectsLoading = false;
      state.isError = true;
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
            submitted_at
        };

        state.projects.push(newProject);
    });
    builder.addCase(createProject.rejected, (state) => {  
        state.isCreatePending = false;
        state.isError = true;
    });
  },
});

export const { toggleAdminActive } = slice.actions;
export default slice.reducer;
