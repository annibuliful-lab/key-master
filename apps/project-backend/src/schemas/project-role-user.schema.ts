import { gql } from 'apollo-server-fastify';
export const typeDefs = gql`
  type DeleteProjectRoleUserOperationResult {
    success: Boolean
  }
  type ProjectRoleUser {
    id: ID!
    userId: ID!
    roleId: ID!
    role: ProjectRole
    projectId: ID!
    project: Project
    active: Boolean!
  }

  input CreateProjectRoleUserInput {
    roleId: ID!
    userId: ID!
    active: Boolean
  }

  input UpdateProjectRoleUserInput {
    roleId: ID
    active: Boolean
  }

  input ProjectRoleUserFilterInput {
    search: String
    cursor: ID
    take: Int
  }

  type Mutation {
    createProjectRoleUser(input: CreateProjectRoleUserInput!): ProjectRoleUser!
      @access(conditions: { permission: "PROJECT_ROLE_USER_WRITE" })

    updateProjectRoleUser(
      id: ID!
      input: UpdateProjectRoleUserInput!
    ): ProjectRoleUser!
      @access(conditions: { permission: "PROJECT_ROLE_USER_WRITE" })

    deleteProjectRoleUser(id: ID!): DeleteProjectRoleUserOperationResult!
      @access(conditions: { permission: "PROJECT_ROLE_USER_WRITE" })
  }

  type Query {
    getProjectRoleUserById(id: ID!): ProjectRoleUser!
      @access(conditions: { permission: "PROJECT_ROLE_USER_READ" })

    getProjectRoleUsers(
      filter: ProjectRoleUserFilterInput!
    ): [ProjectRoleUser!]!
      @access(conditions: { permission: "PROJECT_ROLE_USER_READ" })
  }
`;
