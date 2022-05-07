import { createClient } from './generated';
import * as dotenv from 'dotenv';

dotenv.config();

export const graphqlClient = createClient({
  url: process.env.GRAPHQL_ENDPOINT,
});

interface IProjectOwnerParam {
  projectId: string;
  userId: string;
}
export const projectOwnerGraphqlClient = ({
  projectId,
  userId,
}: IProjectOwnerParam) => {
  return createClient({
    url: process.env.GRAPHQL_ENDPOINT,
    headers: {
      Authorization: `TEST-AUTH ${projectId}`,
      'x-project-id': projectId,
      'x-user-id': userId,
    },
  });
};

export const projectOwnerAClient = projectOwnerGraphqlClient({
  projectId: 'TEST_PROJECT_ID',
  userId: 'TEST_USER_A_ID',
});
