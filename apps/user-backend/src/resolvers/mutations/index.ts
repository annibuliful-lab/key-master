import { Resolvers } from '@key-master/graphql';
import { mutation as UserMutation } from './user.mutation';

export const mutations: Resolvers['Mutation'] = {
  ...UserMutation,
};
