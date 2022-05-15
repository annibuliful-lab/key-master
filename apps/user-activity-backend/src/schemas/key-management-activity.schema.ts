import { gql } from 'apollo-server-fastify';

export const typeDefs = gql`
  input KeyManagementHistoryLogFilterInput {
    skip: Int
    take: Int
  }

  type KeyManagement @key(selectionSet: "{ id }") {
    id: ID!
    historyLogs(filter: KeyManagementHistoryLogFilterInput): [UserActivity]
  }

  type Query {
    _keyManagementActivity(ids: [ID!]!): [KeyManagement!]!
      @merge(keyField: "id")
  }
`;
