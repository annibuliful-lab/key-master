import { Resolvers } from '../../codegen-generated';
import { mutation as AuthMutation } from './auth.mutation';
import { mutation as PermissionMutation } from './permission.mutation';
export const mutations: Resolvers['Mutation'] = {
  ...AuthMutation,
  ...PermissionMutation,
};
