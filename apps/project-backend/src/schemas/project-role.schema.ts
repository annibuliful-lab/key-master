import { gql } from 'apollo-server-fastify';

export const typeDefs = gql`
  type DeleteProjectRoleResult {
    success: Boolean!
  }

  type ProjectRole {
    id: ID!
    projectId: ID!
    role: String!
  }

  input CreateProjectRoleInput {
    role: String!
  }
  input UpdateProjectRoleInput {
    role: String!
  }

  type Mutation {
    createProjectRole(input: CreateProjectRoleInput!): ProjectRole!
      @access(
        conditions: {
          permission: "PROJECT_ROLE_WRITE"
          requiredProjectId: true
        }
      )

    updateProjectRole(id: ID!, input: UpdateProjectRoleInput!): ProjectRole!
      @access(conditions: { permission: "PROJECT_ROLE_WRITE" })

    deleteProjectRole(id: ID!): DeleteProjectRoleResult!
      @access(conditions: { permission: "PROJECT_ROLE_WRITE" })
  }

  type Query {
    getProjectRolesByProject: [ProjectRole!]!
      @access(
        conditions: { permission: "PROJECT_ROLE_READ", requiredProjectId: true }
      )

    getProjectRoleById(id: ID!): ProjectRole!
      @access(
        conditions: { permission: "PROJECT_ROLE_READ", requiredProjectId: true }
      )
  }
`;
