import { gql } from 'apollo-server-fastify';

export const typeDefs = gql`
  enum UserActivityType {
    CREATE
    UPDATE
    DELETE
  }

  type UserActivity {
    id: ID!
    userId: ID!
    serviceName: ID!
    projectId: ID
    description: String
    data: JSON
    type: UserActivityType!
    createdAt: DateTime
    updatedAt: DateTime
  }

  type Query {
    getUserActivityById(id: ID!): UserActivity!
  }
`;
