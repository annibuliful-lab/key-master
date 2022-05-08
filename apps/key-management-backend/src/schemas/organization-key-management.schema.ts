import { gql } from 'apollo-server-fastify';

export const typeDefs = gql`
  type DeleteOrganizationKeyManagementOperationResult {
    success: Boolean!
  }
  type OrganizationKeyManagement {
    id: ID!
    projectOrganizationId: ID!
    keyManagementId: ID!
  }

  input CreateOrganizationKeyManagementInput {
    projectOrganizationId: ID!
    keyManagementId: ID!
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

    pdateOrganizationKeyManagement(
      id: ID!
      input: UpdateOrganizationKeyManagementInput!
    ): OrganizationKeyManagement!

    deleteOrganizationKeyManagement(
      id: ID!
      pin: String!
    ): DeleteOrganizationKeyManagementOperationResult!
  }

  type Query {
    getOrganizationKeyManagementById(id: ID!): OrganizationKeyManagement!

    getOrganizationKeyManagements(
      filter: OrganizationKeyManagementFilterInput!
    ): [OrganizationKeyManagement!]!
  }
`;
