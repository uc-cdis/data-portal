import initialState from './InitialState';

const InitializeCurrentState = () => {
  console.log('called InitializeCurrentState', new Date().toLocaleString())
  return({
  ...initialState,
  selectedTeamProject: localStorage.getItem('teamProject'),
})};

export default InitializeCurrentState;
