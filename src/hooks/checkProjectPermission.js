import { useSelector } from 'react-redux';

/**
 * Check if the current user has authz permission for the project
 * @param {string} projectName has the format: [program]-[project]
 */
export default function checkProjectPermission(projectName) {
  /** @param {{ user: { authz?: Object } }} state */
  const authzSelector = ({ user }) => user.authz;
  const authz = useSelector(authzSelector) ?? {};

  const [p1, p2] = projectName.split('-');
  const resourcePath = `/programs/${p1}/projects/${p2}`;
  return authz?.[resourcePath]?.[0].method === '*';
}
