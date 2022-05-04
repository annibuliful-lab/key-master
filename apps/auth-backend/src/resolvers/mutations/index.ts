import { Resolvers } from '../../codegen-generated';
import { mutation as AuthMutation } from './auth.mutation';

export const mutations: Resolvers['Mutation'] = {
  ...AuthMutation,
};
