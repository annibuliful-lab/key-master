import { gql } from 'apollo-server-fastify';

export const typeDefs = gql`
  type DeleteProjectOrganizationOperationResult {
    success: Boolean!
  }

  type ProjectOrganization {
    id: ID!
    projectId: ID!
    project: Project
    name: String!
    active: Boolean!
  }

  type OrganizationKeyManagement
    @key(selectionSet: "{ projectOrganizationId }") {
    projectOrganizationId: ID!
    projectOrganization: ProjectOrganization
  }

  input OrganizationKeyManagementKey {
    projectOrganizationId: ID!
  }

  input CreateProjectOrganizationInput {
    name: String!
    active: Boolean
  }

  input UpdateProjectOrganizationInput {
    name: String
    active: Boolean
  }
  input ProjectOrganizationFilterInput {
    search: String
    cursor: ID
    take: Int
  }

  type Mutation {
    createProjectOrganization(
      input: CreateProjectOrganizationInput
    ): ProjectOrganization!

    updateProjectOrganization(
      id: ID!
      input: UpdateProjectOrganizationInput
    ): ProjectOrganization!

    deleteProjectOrganization(
      id: ID!
    ): DeleteProjectOrganizationOperationResult!
  }

  type Query {
    getProjectOrganizationById(id: ID!): ProjectOrganization!

    getProjectOrganizations(
      filter: ProjectOrganizationFilterInput
    ): [ProjectOrganization!]!

    _projectOrganizationKeyManagement(
      keys: [OrganizationKeyManagementKey!]!
    ): [OrganizationKeyManagement!]! @merge(keyArg: "keys")
  }
`;
