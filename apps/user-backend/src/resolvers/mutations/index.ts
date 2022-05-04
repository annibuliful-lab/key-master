import { Resolvers } from '../../codegen-generated';
import { mutation as UserMutation } from './user.mutation';

export const mutations: Resolvers['Mutation'] = {
  ...UserMutation,
};
