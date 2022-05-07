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

  input CreateUserInput {
    username: String!
    password: String!
    fullname: String!
  }

  type Query {
    me: User!
    users: [User]
    _userProfile(keys: [AuthUserKey!]!): [Authentication]!
      @merge(keyArg: "keys")
  }

  type Mutation {
    createUser(input: CreateUserInput): User!
  }
`;
