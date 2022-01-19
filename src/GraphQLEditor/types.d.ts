import type { GraphQLSchema } from 'graphql';

export type GraphiqlState = {
  schema: GraphQLSchema;
  guppySchema: GraphQLSchema;
};
