import { gql } from 'apollo-server-fastify';

export const typeDefs = gql`
  type ProjectRolePermission {
    id: ID!
    roleId: ID!
    role: ProjectRole
    permissionId: ID!
  }

  input SetProjectRolePermissionsInput {
    roleId: ID!
    permissionIds: [String!]!
  }

  type Mutation {
    setProjectRolePermissions(
      input: SetProjectRolePermissionsInput!
    ): [ProjectRolePermission!]!
  }

  type Query {
    getProjectRolePermissionByRoleId(id: ID!): [ProjectRolePermission!]!
  }
`;
