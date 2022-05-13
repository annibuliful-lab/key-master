import { gql } from 'apollo-server-fastify';

export const typeDefs = gql`
  enum UserActivityType {
    CREATE
    UPDATE
    DELETE
    READ
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

  input UserActivityFilterInput {
    search: String
    cursor: ID
    take: Int
    userId: String
    projectId: String
    serviceName: String
    type: [UserActivityType!]
  }

  type Query {
    getUserActivityById(id: ID!): UserActivity!
      @access(
        conditions: { permission: "USER_ACTIVITY_READ", roleName: "KeyAdmin" }
      )

    getUsersActivities(filter: UserActivityFilterInput!): [UserActivity!]!
      @access(
        conditions: { permission: "USER_ACTIVITY_READ", roleName: "KeyAdmin" }
      )
  }
`;