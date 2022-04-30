import { Resolvers } from '@key-master/graphql';
import { mutation as UserMutation } from './user.mutation';
import { mutation as AuthMutation } from './auth.mutation';

export const mutations: Resolvers['Mutation'] = {
  ...UserMutation,
  ...AuthMutation,
};
