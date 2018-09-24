import { ARRANGER_API } from '@arranger/components/dist/utils/config';
import urlJoin from 'url-join';

const arrangerApi = (endpoint , body, headers) =>
  fetch(urlJoin(ARRANGER_API, endpoint ? endpoint : ''), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
    credentials: 'include',
  }).then(res => res.json());

export default arrangerApi;
