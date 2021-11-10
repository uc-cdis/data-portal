import { Environment, Network, RecordSource, Store } from 'relay-runtime';
import { headers, graphqlPath } from './localconf';

const store = new Store(new RecordSource());

/** @type {import('relay-runtime').FetchFunction} */
const fetchQuery = (operation, variables) =>
  fetch(graphqlPath, {
    credentials: 'same-origin',
    headers,
    method: 'POST',
    body: JSON.stringify({ query: operation.text, variables }),
  })
    .then((response) => response.text())
    .then((responseBody) => {
      try {
        return JSON.parse(responseBody);
      } catch (error) {
        return responseBody;
      }
    });

const network = Network.create(fetchQuery);

const environment = new Environment({
  network,
  store,
});

export default environment;
