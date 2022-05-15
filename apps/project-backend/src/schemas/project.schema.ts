import { gql } from 'apollo-server-fastify';

export const typeDefs = gql`
  type DeleteProjectResult {
    success: Boolean!
  }

  type Project {
    id: ID!
    name: String!
    logo: String
    tags: [ProjectTag]
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
    createProject(input: CreateProjectInput!): Project! @authorized
    updateProject(id: ID!, input: UpdateProjectInput!): Project! @authorized
    deleteProject(id: ID!): DeleteProjectResult! @authorized
  }

  type Query {
    getProjectById(id: ID!): Project!
      @access(conditions: { permission: "PROJECT_READ" })

    getProjectsByOwner: [Project!]! @authorized
  }
`;
