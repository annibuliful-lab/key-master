import { generate } from '@genql/cli';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

generate({
  endpoint: process.env.GRAPHQL_ENDPOINT,
  useGet: true,
  output: path.join(__dirname, '../../libs/test/src/generated'),
}).catch(console.error);
