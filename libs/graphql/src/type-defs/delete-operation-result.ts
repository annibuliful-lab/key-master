import { gql } from 'apollo-server-fastify';

export const deleteOperationTypeDef = gql`
  type DeleteOperationResult {
    success: Boolean!
  }
`;
