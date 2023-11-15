const IsCurrentTeamProjectValid = (data) => {
  let currentTeamProjectIsValid = false;
  const currentTeamProject = localStorage.getItem('teamProject');
  data.teams.forEach((team) => {
    if (team.teamName === currentTeamProject) {
      currentTeamProjectIsValid = true;
    }
  });
  if (currentTeamProjectIsValid === false) {
    localStorage.removeItem('teamProject');
  }
  return currentTeamProjectIsValid;
};

export default IsCurrentTeamProjectValid;
