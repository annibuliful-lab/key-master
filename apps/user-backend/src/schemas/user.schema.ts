import { gql } from 'apollo-server-fastify';

export const typeDefs = gql`
  type User {
    id: ID!
    fullname: String!
  }

  type Authentication @key(selectionSet: "{ id }") {
    id: ID!
    user: User!
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
    users: [User]
    _userProfile(keys: [AuthUserKey!]!): [Authentication]! @merge
  }

  type Mutation {
    createUser(input: CreateUserInput): User!
  }
`;
