import { gql } from 'apollo-server-fastify';

export const typeDefs = gql`
  type DeleteProjectOperationResult {
    success: Boolean!
  }

  type ProjectTag {
    id: ID!
    tag: String!
    projectId: ID!
  }

  input CreateProjectTagInput {
    tag: String!
  }

  input UpdateProjectTagInput {
    tag: String!
  }

  type Mutation {
    createProjectTag(input: CreateProjectTagInput!): ProjectTag
      @access(conditions: { requiredProjectId: true })

    updateProjectTag(id: ID!, input: UpdateProjectTagInput!): ProjectTag
      @access(conditions: { requiredProjectId: true })

    deleteProjectTag(id: ID!): DeleteProjectOperationResult!
      @access(conditions: { requiredProjectId: true })
  }
`;
