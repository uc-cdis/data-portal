import { createAsyncThunk } from '@reduxjs/toolkit';
import { buildClientSchema, getIntrospectionQuery } from 'graphql/utilities';
import { guppyGraphQLUrl, headers } from '../../localconf';

/** @typedef {import('../types').RootState} RootState */

export const fetchGuppySchema = createAsyncThunk(
  'graphiql/fetchGuppySchema',
  async (_, { getState }) => {
    const state = /** @type {RootState} */ (getState());
    if (state.graphiql.guppySchema) return Promise.resolve(null);

    const response = await fetch(guppyGraphQLUrl, {
      credentials: 'include',
      headers,
      method: 'POST',
      body: JSON.stringify({
        query: getIntrospectionQuery(),
        operationName: 'IntrospectionQuery',
      }),
    });
    const { data } = await response.json();
    return buildClientSchema(data);
  }
);

export const fetchSchema = createAsyncThunk(
  'graphiql/fetchSchema',
  async (_, { getState }) => {
    const state = /** @type {RootState} */ (getState());
    if (state.graphiql.schema) return Promise.resolve(null);

    /** @type {any} */
    const { data } = (await import('../../../data/schema.json')).default;
    return buildClientSchema(data);
  }
);
