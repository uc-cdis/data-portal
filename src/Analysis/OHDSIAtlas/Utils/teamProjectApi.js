import { authzMappingPath } from '../../../configs';

const fetchAuthorizationMappingsForCurrentUser = async () => {
  const response = await fetch(authzMappingPath);
  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }
  return response.json();
};

export default fetchAuthorizationMappingsForCurrentUser;
