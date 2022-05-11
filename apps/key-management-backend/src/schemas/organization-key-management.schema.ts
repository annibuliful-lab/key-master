import { gql } from 'apollo-server-fastify';

export const typeDefs = gql`
  type DeleteOrganizationKeyManagementOperationResult {
    success: Boolean!
  }
  type OrganizationKeyManagement {
    id: ID!
    projectOrganizationId: ID!
    keyManagementId: ID!
    keyManagement: KeyManagement
    active: Boolean!
  }

  input CreateOrganizationKeyManagementInput {
    projectOrganizationId: ID!
    keyManagementId: ID!
    active: Boolean
  }

  input UpdateOrganizationKeyManagementInput {
    active: Boolean
  }

  input OrganizationKeyManagementFilterInput {
    search: String
    cursor: ID
    take: Int
    organizationId: ID!
  }

  type Mutation {
    createOrganizationKeyManagement(
      input: CreateOrganizationKeyManagementInput!
    ): OrganizationKeyManagement!
      @access(conditions: { permission: "ORGANIZATION_KEY_MANAGEMENT_WRITE" })

    updateOrganizationKeyManagement(
      id: ID!
      input: UpdateOrganizationKeyManagementInput!
    ): OrganizationKeyManagement!
      @access(conditions: { permission: "ORGANIZATION_KEY_MANAGEMENT_WRITE" })

    deleteOrganizationKeyManagement(
      id: ID!
      pin: String!
    ): DeleteOrganizationKeyManagementOperationResult!
      @access(conditions: { permission: "ORGANIZATION_KEY_MANAGEMENT_WRITE" })
  }

  type Query {
    getOrganizationKeyManagementById(id: ID!): OrganizationKeyManagement!
      @access(conditions: { permission: "ORGANIZATION_KEY_MANAGEMENT_READ" })

    getOrganizationKeyManagements(
      filter: OrganizationKeyManagementFilterInput!
    ): [OrganizationKeyManagement!]!
      @access(conditions: { permission: "ORGANIZATION_KEY_MANAGEMENT_READ" })
  }
`;
