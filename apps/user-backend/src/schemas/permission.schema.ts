import { deleteOperationTypeDef } from '@key-master/graphql';
import { gql } from 'apollo-server-fastify';

export const typeDefs = gql`
  ${deleteOperationTypeDef}
  type Permission {
    id: ID!
    permission: String!
  }

  type Mutation {
    createPermission(permission: String!): Permission!
    updatePermission(id: ID!, permission: String!): Permission!
    deletePermission(id: ID!): DeleteOperationResult!
  }

  type Query {
    getPermissionById(id: ID!): Permission!
  }
`;
