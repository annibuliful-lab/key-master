import { gql } from 'apollo-server-fastify';

export const typeDefs = gql`
  type User {
    id: ID!
    fullname: String!
  }

  type Authentication @key(selectionSet: "{ id }") {
    id: ID!
    user: User
  }

  input AuthUserKey {
    id: ID!
  }

  type ProjectRoleUser @key(selectionSet: "{ userId }") {
    userId: ID!
    user: User
  }

  type OrganizationUser @key(selectionSet: "{ userId }") {
    userId: ID!
    user: User
  }

  input OrganizationUserKey {
    userId: ID!
  }

  input ProjectRoleUserKey {
    userId: ID!
  }

  input CreateUserInput {
    username: String!
    password: String!
    fullname: String!
  }

  type Query {
    me: User! @authorized

    _userProfile(keys: [AuthUserKey!]!): [Authentication]!
      @merge(keyArg: "keys")

    _projectRoleUserProfile(keys: [ProjectRoleUserKey!]!): [ProjectRoleUser]!
      @merge(keyArg: "keys")

    _organizationUserProfile(
      keys: [OrganizationUserKey!]!
    ): [OrganizationUser!]! @merge(keyArg: "keys")
  }

  type Mutation {
    createUser(input: CreateUserInput): User!
  }
`;
