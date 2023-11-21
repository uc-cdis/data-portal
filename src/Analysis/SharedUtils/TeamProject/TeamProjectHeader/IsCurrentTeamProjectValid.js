const IsCurrentTeamProjectValid = (data) => {
  if (!data.teams) {
    return false;
  }
  let currentTeamProjectIsValid = false;
  const currentTeamProject = localStorage.getItem('teamProject');
  data.teams.forEach((team) => {
    if (team.teamName === currentTeamProject) {
      currentTeamProjectIsValid = true;
    }
  });
  return currentTeamProjectIsValid;
};

export default IsCurrentTeamProjectValid;
