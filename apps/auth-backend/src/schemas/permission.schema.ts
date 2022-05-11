import { gql } from 'apollo-server-fastify';

export const typeDefs = gql`
  type DeleteOperationResult {
    success: Boolean!
  }

  type Permission {
    id: ID!
    permission: String!
  }

  input PermissionFilterInput {
    search: String
    cursor: ID
    take: Int
  }

  type ProjectRolePermission @key(selectionSet: "{ permissionId }") {
    permissionId: ID!
    permission: Permission
  }

  input ProjectRolePermissionKey {
    permissionId: ID!
  }

  type Mutation {
    createPermission(permission: String!): Permission!
      @access(
        conditions: { permission: "PERMISSION_WRITE", roleName: "KeyAdmin" }
      )

    updatePermission(id: ID!, permission: String!): Permission!
      @access(
        conditions: { permission: "PERMISSION_WRITE", roleName: "KeyAdmin" }
      )

    deletePermission(id: ID!): DeleteOperationResult!
      @access(
        conditions: { permission: "PERMISSION_WRITE", roleName: "KeyAdmin" }
      )
  }

  type Query {
    getPermissionById(id: ID!): Permission!
      @access(
        conditions: { permission: "PERMISSION_READ", roleName: "KeyAdmin" }
      )

    getPermissions(filter: PermissionFilterInput): [Permission!]!
      @access(
        conditions: { permission: "PERMISSION_READ", roleName: "KeyAdmin" }
      )

    _projectRoleUserPermission(
      keys: [ProjectRolePermissionKey!]!
    ): [ProjectRolePermission]! @merge(keyArg: "keys")
  }
`;
