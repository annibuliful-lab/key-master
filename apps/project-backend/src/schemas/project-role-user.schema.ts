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

    updateProjectRoleUser(
      id: ID!
      input: UpdateProjectRoleUserInput!
    ): ProjectRoleUser!

    deleteProjectRoleUser(id: ID!): DeleteProjectRoleUserOperationResult!
  }

  type Query {
    getProjectRoleUserById(id: ID!): ProjectRoleUser!

    getProjectRoleUsers(
      filter: ProjectRoleUserFilterInput!
    ): [ProjectRoleUser!]!
  }
`;
