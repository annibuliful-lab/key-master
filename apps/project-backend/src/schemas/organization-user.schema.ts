import { gql } from 'apollo-server-fastify';

export const typeDefs = gql`
  type DeleteOrganizationOperationResult {
    success: Boolean!
  }

  type OrganizationUser {
    id: ID!
    organizationId: ID!
    userId: ID!
    active: Boolean!
  }

  input CreateOrganizationUserInput {
    organizationId: ID!
    userId: ID!
    active: Boolean
  }

  input UpdateOrganizationUserInput {
    active: Boolean
  }

  input OrganizationUserFilterInput {
    search: String
    cursor: ID
    take: Int
  }

  type Mutation {
    createOrganizationUser(
      input: CreateOrganizationUserInput!
    ): OrganizationUser!

    updateOrganizationUser(
      id: ID!
      input: UpdateOrganizationUserInput!
    ): OrganizationUser!

    deleteOrganizationUser(id: ID!): DeleteOrganizationOperationResult!
  }

  type Query {
    getOrganizationUserById(id: ID!): OrganizationUser!

    getOrganizationUsers(
      filter: OrganizationUserFilterInput!
    ): [OrganizationUser!]!
  }
`;
