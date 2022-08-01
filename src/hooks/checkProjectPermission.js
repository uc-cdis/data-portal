import { useAppSelector } from '../redux/hooks';

/**
 * Check if the current user has authz permission for the project
 * @param {string} projectName has the format: [program]-[project]
 */
export default function checkProjectPermission(projectName) {
  const [p1, p2] = projectName.split('-');
  const resourcePath = `/programs/${p1}/projects/${p2}`;

  const authz = useAppSelector((state) => state.user.authz);
  return authz?.[resourcePath]?.[0].method === '*';
}
