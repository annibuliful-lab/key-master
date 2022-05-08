import { gql } from 'apollo-server-fastify';

export const typeDefs = gql`
  type KeyManagementDeleteOperationResult {
    success: Boolean!
  }

  type KeyManagement {
    id: ID!
    projectId: ID!
    name: String!
    masterKey(pin: String): String
  }

  input CreateKeyManagementInput {
    name: String!
    pin: String!
    masterKey: String!
  }

  input UpdateKeyManagementInput {
    pin: String!
    name: String!
  }

  input UpdateKeyManagementPinInput {
    oldPin: String!
    newPin: String!
  }

  type Mutation {
    createKeyManagement(input: CreateKeyManagementInput!): KeyManagement!

    updateKeyManagement(
      id: ID!
      input: UpdateKeyManagementInput!
    ): KeyManagement!

    updateKeyManagementPin(
      id: ID!
      input: UpdateKeyManagementPinInput!
    ): KeyManagement!

    deleteKeyMangement(
      id: ID!
      pin: String!
    ): KeyManagementDeleteOperationResult!
  }

  type Query {
    getKeyManagementById(id: ID!): KeyManagement!
    getKeyManagementByIds(ids: [ID!]!): [KeyManagement!]!
  }
`;
