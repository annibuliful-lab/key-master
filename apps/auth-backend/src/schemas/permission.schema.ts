import { gql } from 'apollo-server-fastify';

export const typeDefs = gql`
  type DeleteOperationResult {
    success: Boolean!
  }

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
