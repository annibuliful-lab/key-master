import { createClient } from './generated';
import * as dotenv from 'dotenv';

dotenv.config();

export const graphqlClient = createClient({
  url: process.env.GRAPHQL_ENDPOINT,
});

interface IProjectOwnerParam {
  projectId: string;
  token: string;
}
export const projectOwnerGraphqlClient = ({
  projectId,
  token,
}: IProjectOwnerParam) => {
  return createClient({
    url: process.env.GRAPHQL_ENDPOINT,
    headers: {
      Authorization: `TEST ${token}-${projectId}`,
    },
  });
};
