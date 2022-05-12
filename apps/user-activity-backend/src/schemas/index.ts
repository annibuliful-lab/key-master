import { mergeTypeDefs } from '@graphql-tools/merge';
import { typeDefs as UserActivitySchema } from './user-activity.schema';

export const typeDefs = mergeTypeDefs(UserActivitySchema);
