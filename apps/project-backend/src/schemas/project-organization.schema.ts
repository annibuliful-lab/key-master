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
      @access(conditions: { permission: "PROJECT_ORGANIZATION_WRITE" })

    updateProjectOrganization(
      id: ID!
      input: UpdateProjectOrganizationInput
    ): ProjectOrganization!
      @access(conditions: { permission: "PROJECT_ORGANIZATION_WRITE" })

    deleteProjectOrganization(
      id: ID!
    ): DeleteProjectOrganizationOperationResult!
      @access(conditions: { permission: "PROJECT_ORGANIZATION_WRITE" })
  }

  type Query {
    getProjectOrganizationById(id: ID!): ProjectOrganization!
      @access(conditions: { permission: "PROJECT_ORGANIZATION_READ" })

    getProjectOrganizations(
      filter: ProjectOrganizationFilterInput
    ): [ProjectOrganization!]!
      @access(conditions: { permission: "PROJECT_ORGANIZATION_READ" })

    _projectOrganizationKeyManagement(
      keys: [OrganizationKeyManagementKey!]!
    ): [OrganizationKeyManagement!]! @merge(keyArg: "keys")
  }
`;
