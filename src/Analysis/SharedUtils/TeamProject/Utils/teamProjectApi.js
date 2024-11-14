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
  const teamProjectList = Object.entries(authorizationMappings)
    .filter(([key, value]) => key.startsWith('/gwas_projects/')  && value.some(e=> e.service === "atlas-argo-wrapper-and-cohort-middleware"))
    .map(([key, value]) => ({ teamName: key }));

  return { teams: teamProjectList };
};

export default fetchArboristTeamProjectRoles;
