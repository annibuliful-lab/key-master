import { gql } from 'apollo-server-fastify';

export const typeDefs = gql`
  type DeleteProjectResult {
    success: Boolean!
  }

  type Project {
    id: ID!
    name: String!
    logo: String
  }

  input CreateProjectInput {
    name: String!
    logo: String
  }

  input UpdateProjectInput {
    name: String
    logo: String
  }

  type Mutation {
    createProject(input: CreateProjectInput!): Project!
    updateProject(id: ID!, input: UpdateProjectInput!): Project!
    deleteProject(id: ID!): DeleteProjectResult!
  }

  type Query {
    getProjectById(id: ID!): Project!
  }
`;
