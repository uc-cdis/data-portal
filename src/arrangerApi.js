import { ARRANGER_API } from '@arranger/components/dist/utils/config';
import urlJoin from 'url-join';
import { addDownloadHttpHeaders } from '@arranger/components/dist/utils/download';

/* File from @arranger node module - customized to pass additional params in fetch request */

let alwaysSendHeaders = { 'Content-Type': 'application/json' };

const api = ({ endpoint = '', body, headers }) => fetch(urlJoin(ARRANGER_API, endpoint), {
  method: 'POST',
  headers: { ...alwaysSendHeaders, ...headers },
  body: JSON.stringify(body),
  credentials: 'include',
}).then(r => r.json());

export const graphql = body => api({ endpoint: 'graphql', body });

export const fetchExtendedMapping = ({ graphqlField, projectId }) =>
  api({
    endpoint: `/${projectId}/graphql`,
    body: {
      query: `
        {
          ${graphqlField}{
            extended
          }
        }
      `,
    },
  }).then(response => ({
    extendedMapping: response.data[graphqlField].extended,
  }));

export const addHeaders = (headers) => {
  alwaysSendHeaders = { ...alwaysSendHeaders, ...headers };
  addDownloadHttpHeaders(headers);
};

export const getAlwaysAddHeaders = () => alwaysSendHeaders;

export default api;
