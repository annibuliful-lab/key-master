import { gql } from 'apollo-server-fastify';

export const typeDefs = gql`
  type ProjectRole {
    id: ID!
    projectId: ID!
    role: String!
  }

  input CreateProjectRoleInput {
    role: String!
  }
  input UpdateProjectRoleInput {
    role: String!
  }

  type Mutation {
    createProjectRole(input: CreateProjectRoleInput): ProjectRole!
    updateProjectRole(id: ID!, input: UpdateProjectRoleInput): ProjectRole!
    deleteProjectRole(id: ID!): ProjectRole!
  }

  type Query {
    getProjectRoleByProject: [ProjectRole!]!
    getProjectRoleById(id: ID!): [ProjectRole!]!
  }
`;
