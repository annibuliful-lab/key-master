import { createClient } from './generated';
import * as dotenv from 'dotenv';

dotenv.config();

export const graphqlClient = createClient({
  url: process.env.GRAPHQL_ENDPOINT,
});
