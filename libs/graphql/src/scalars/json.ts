import GraphQLJSON, { GraphQLJSONObject } from 'graphql-type-json';
import { gql } from 'graphql-tag';
import { IResolvers } from '@graphql-tools/utils';

export const jsonScalarTypeDefs = gql`
  scalar JSON
  scalar JSONObject
`;

export const jsonScalarResolver: IResolvers = {
  JSON: GraphQLJSON,
  JSONObject: GraphQLJSONObject,
};
