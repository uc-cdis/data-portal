import { buildClientSchema, getIntrospectionQuery } from 'graphql/utilities';
import { guppyGraphQLUrl, headers } from '../localconf';
import { receiveGuppySchema, receiveSchema } from './actions';

/**
 * Fetch the schema for graphi, and stuff it into redux - handled by router
 */
export function fetchSchema() {
  /**
   * @param {import('redux').Dispatch} dispatch
   * @param {() => { graphiql: import('./types').GraphiqlState }} getState
   */
  return (dispatch, getState) =>
    getState().graphiql.schema
      ? Promise.resolve()
      : import('../../data/schema.json').then(({ default: data }) =>
          dispatch(
            receiveSchema(buildClientSchema(/** @type {any} */ (data).data))
          )
        );
}

export function fetchGuppySchema() {
  /**
   * @param {import('redux').Dispatch} dispatch
   * @param {() => { graphiql: import('./types').GraphiqlState }} getState
   */
  return (dispatch, getState) =>
    getState().graphiql.guppySchema
      ? Promise.resolve()
      : fetch(guppyGraphQLUrl, {
          credentials: 'include',
          headers,
          method: 'POST',
          body: JSON.stringify({
            query: getIntrospectionQuery(),
            operationName: 'IntrospectionQuery',
          }),
        })
          .then((response) => response.json())
          .then(({ data }) =>
            dispatch(receiveGuppySchema(buildClientSchema(data)))
          );
}
