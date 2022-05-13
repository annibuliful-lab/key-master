import { gql } from 'apollo-server-fastify';

export const typeDefs = gql`
  type DeleteOrganizationOperationResult {
    success: Boolean!
  }

  type OrganizationKeyManagementUserBookmark {
    id: ID!
    projectOrganizationId: ID!
    userId: ID!
    keyManagementId: ID!
  }

  input CreateOrganizationKeyManagementUserBookmarkInput {
    keyManagementId: ID!
  }

  input OrganizationKeyManagementUserBookmarkFilterInput {
    organizationId: String
    search: String
    cursor: ID
    take: Int
  }

  type Mutation {
    createOrganizationKeyManagementUserBookmark(
      input: CreateOrganizationKeyManagementUserBookmarkInput!
    ): OrganizationKeyManagementUserBookmark!
      @access(conditions: { requiredOrgId: true })

    deletedOrganizationKeyManagementUserBookmark(
      id: ID!
    ): DeleteOrganizationOperationResult!
      @access(conditions: { requiredOrgId: true })
  }

  type Query {
    getOrganizationKeyManagementUserBookmarkById(
      id: ID!
    ): OrganizationKeyManagementUserBookmark!
      @access(conditions: { requiredOrgId: true })

    getOrganizationKeyManagementUserBookmarks(
      filter: OrganizationKeyManagementUserBookmarkFilterInput
    ): [OrganizationKeyManagementUserBookmark!]!
      @access(conditions: { requiredOrgId: true })
  }
`;
