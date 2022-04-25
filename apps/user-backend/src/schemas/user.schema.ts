import { gql } from 'apollo-server-fastify';

export const typeDefs = gql`
  type User {
    id: ID!
    fullname: String!
  }

  input CreateUserInput {
    username: String!
    password: String!
    fullname: String!
  }

  type Query {
    users: [User]
  }

  type Mutation {
    createUser(input: CreateUserInput): User!
  }
`;
