import { gql } from 'apollo-server-fastify';

export const typeDefs = gql`
  type DeleteOrganizationOperationResult {
    success: Boolean!
  }

  type OrganizationUser {
    id: ID!
    organizationId: ID!
    organization: ProjectOrganization
    userId: ID!
    active: Boolean!
  }

  input CreateOrganizationUserInput {
    organizationId: ID!
    userId: ID!
    active: Boolean
  }

  input UpdateOrganizationUserInput {
    active: Boolean
  }

  input OrganizationUserFilterInput {
    search: String
    cursor: ID
    take: Int
    organizationId: ID!
  }

  type Mutation {
    createOrganizationUser(
      input: CreateOrganizationUserInput!
    ): OrganizationUser!
      @access(conditions: { permission: "PROJECT_ORGANIZATION_USER_WRITE" })

    updateOrganizationUser(
      id: ID!
      input: UpdateOrganizationUserInput!
    ): OrganizationUser!
      @access(conditions: { permission: "PROJECT_ORGANIZATION_USER_WRITE" })

    deleteOrganizationUser(id: ID!): DeleteOrganizationOperationResult!
      @access(conditions: { permission: "PROJECT_ORGANIZATION_USER_WRITE" })
  }

  type Query {
    getOrganizationUserById(id: ID!): OrganizationUser!
      @access(conditions: { permission: "PROJECT_ORGANIZATION_USER_READ" })

    getOrganizationUsers(
      filter: OrganizationUserFilterInput!
    ): [OrganizationUser!]!
      @access(conditions: { permission: "PROJECT_ORGANIZATION_USER_READ" })
  }
`;
