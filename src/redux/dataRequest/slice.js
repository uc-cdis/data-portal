import { createSlice } from '@reduxjs/toolkit';
import { fetchProjects, createProject } from './asyncThunks';
import { useAppSelector } from '../hooks';

const slice = createSlice({
  name: 'dataRequest',
  initialState: /** @type {import('./types').DataRequestState} */ ({
    projects: [],
    isError: false,
    isAdminActive: false,
    isProjectsLoading: false,
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
    builder.addCase(createProject.fulfilled, (state, action) => {
        if (action.payload === null) return;

        let { user_id: currentUserId, additional_info: { firstName, lastName, institution} } = useAppSelector((state) => state.user);
        let { id, name, create_date: submitted_at, associated_users  } = action.payload;
        let researcher = associated_users.find(({ user_id }) => user_id === currentUserId );

        let newProject = {
            completed_at: "",
            has_access: false,
            id,
            name,
            researcher: {
                first_name: firstName,
                last_name: lastName,
                institution,
                id: researcher.id
            },
            /** @type {'In Review'} */
            status: 'In Review',
            submitted_at
        };

        state.projects.push(newProject);
    });
    builder.addCase(createProject.rejected, (state) => {  
        state.isError = true;
    });
  },
});

export const { toggleAdminActive } = slice.actions;
export default slice.reducer;
