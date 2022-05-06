import { gql } from 'apollo-server-fastify';

export const typeDefs = gql`
  type Project {
    id: ID!
    name: String!
    logo: String
  }

  input CreateProjectInput {
    name: String!
    logo: String
  }

  type Mutation {
    createProject(input: CreateProjectInput!): Project!
  }

  type Query {
    getProjectById(id: ID!): Project!
  }
`;
