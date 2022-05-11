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
      @access(conditions: { permission: "KEY_MANAGEMENT_WRITE" })

    updateKeyManagement(
      id: ID!
      input: UpdateKeyManagementInput!
    ): KeyManagement!
      @access(conditions: { permission: "KEY_MANAGEMENT_WRITE" })

    updateKeyManagementPin(
      id: ID!
      input: UpdateKeyManagementPinInput!
    ): KeyManagement!
      @access(conditions: { permission: "KEY_MANAGEMENT_UPDATE_PIN" })

    deleteKeyMangement(
      id: ID!
      pin: String!
    ): KeyManagementDeleteOperationResult!
      @access(conditions: { permission: "KEY_MANAGEMENT_WRITE" })
  }

  type Query {
    getKeyManagementById(id: ID!): KeyManagement!
      @access(conditions: { permission: "KEY_MANAGEMENT_READ" })

    getKeyManagementByIds(ids: [ID!]!): [KeyManagement!]!
      @access(conditions: { permission: "KEY_MANAGEMENT_READ" })
  }
`;
