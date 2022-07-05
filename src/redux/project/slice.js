import { createSlice } from '@reduxjs/toolkit';
import { fetchProjects } from './asyncThunks';

/** @typedef {import('./types').ProjectState} ProjectState */

const slice = createSlice({
  name: 'project',
  initialState: /** @type {ProjectState} */ ({}),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProjects.fulfilled, (state, action) => {
      if (action.payload === null) return;

      const projects = /** @type {ProjectState['projects']} */ ({});
      const projectAvail = /** @type {ProjectState['projectAvail']} */ ({});
      for (const p of action.payload) {
        projects[p.code] = p.project_id;
        projectAvail[p.project_id] = p.availability_type;
      }

      state.projects = projects;
      state.projectAvail = projectAvail;
    });
  },
});

export default slice.reducer;
