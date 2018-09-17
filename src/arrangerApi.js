import { ARRANGER_API } from '@arranger/components/dist/utils/config';
import urlJoin from 'url-join';

/* File from @arranger node module - customized to pass additional params in fetch request */

const alwaysSendHeaders = { 'Content-Type': 'application/json' };

const api = ({ endpoint = '', body, headers }) => fetch(urlJoin(ARRANGER_API, endpoint), {
  method: 'POST',
  headers: { ...alwaysSendHeaders, ...headers },
  body: JSON.stringify(body),
  credentials: 'include',
}).then(r => r.json());

export default api;
