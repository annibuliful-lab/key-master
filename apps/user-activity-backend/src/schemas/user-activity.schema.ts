import { gql } from 'apollo-server-fastify';

export const typeDefs = gql`
  enum UserActivityType {
    CREATE
    UPDATE
    DELETE
    READ
  }

  enum ServiceName {
    KeyManagement
    Authentication
    Project
    ProjectOrganization
    OrganizationUserKeyBookmark
    ProjectRole
    ProjectRoleUser
    ProjectRolePermission
    ProjectTag
  }

  type UserActivity {
    id: ID!
    userId: ID!
    serviceName: ServiceName!
    parentPkId: ID!
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
    parentPkId: String
    serviceName: String
    type: [UserActivityType!]
  }

  input CreateUserActivityInput {
    userId: ID!
    serviceName: ServiceName!
    projectId: ID
    parentPkId: ID!
    description: String
    data: JSON
    type: UserActivityType!
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

  type Mutation {
    createUserActivity(input: CreateUserActivityInput): UserActivity!
      @access(
        conditions: { permission: "USER_ACTIVITY_WRITE", roleName: "KeyAdmin" }
      )
  }
`;
