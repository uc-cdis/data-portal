import initialState from './InitialState';

const InitializeCurrentState = () => ({
  ...initialState,
  selectedTeamProject: localStorage.getItem('teamProject'),
});

export default InitializeCurrentState;
