import {
  Environment,
  Network,
  RecordSource,
  Store,
} from 'relay-runtime';

import {headers, graphqlPath} from './configs'

const store = new Store(new RecordSource());

const fetchQuery = (operation, variables, cacheConfig) => {
  let request = {
    credentials: "same-origin",
    headers: {...headers},
    method: 'POST',
    body: JSON.stringify({query: operation.text,
    variables}),
  };

  return fetch(graphqlPath, request).then(function (response) {
    return response.text();
  }).then(function (responseBody) {
    try {
      return JSON.parse(responseBody);
    } catch (error) {
      return responseBody;
    }
  });
};

const network = Network.create(fetchQuery);

const environment = new Environment({
  network,
  store
});

export default environment
