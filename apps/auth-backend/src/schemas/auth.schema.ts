import { gql } from 'apollo-server-fastify';

export const typeDefs = gql`
  type Authentication {
    id: ID!
    fullname: String!
    token: String!
    refreshToken: String!
  }

  input LoginInput {
    username: String!
    password: String!
  }

  type Mutation {
    login(input: LoginInput): Authentication!
  }
`;
