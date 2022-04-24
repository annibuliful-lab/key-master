import { createServer } from '@key-master/graphql';
import { typeDefs } from './user.schema';

createServer({ typeDefs, port: 3000 });
