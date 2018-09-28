import urlJoin from 'url-join';
import { ARRANGER_API } from '@arranger/components/dist/utils/config';

const arrangerApi = ({ endpoint, headers, body }) =>
  fetch(urlJoin(ARRANGER_API, endpoint || ''), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
    credentials: 'include',
  }).then(res => res.json());

export default arrangerApi;
