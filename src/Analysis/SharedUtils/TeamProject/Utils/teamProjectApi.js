import { authzMappingPath } from '../../../../configs';

const fetchAuthorizationMappingsForCurrentUser = async () => {
  const response = await fetch(authzMappingPath);
  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }
  return response.json();
};

const fetchArboristTeamProjectRoles = async () => {
  const authorizationMappings = await fetchAuthorizationMappingsForCurrentUser();
  const teamProjectList = Object.keys(authorizationMappings)
    .filter((key) => key.startsWith('/gwas_projects/'))
    .map((key) => ({ teamName: key }));
  return { teams: teamProjectList };
};

export default fetchArboristTeamProjectRoles;
