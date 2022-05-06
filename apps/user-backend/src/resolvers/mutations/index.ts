import { Resolvers } from '../../codegen-generated';
import { mutation as UserMutation } from './user.mutation';
import { mutation as PermissionMutation } from './permission';

export const mutations: Resolvers['Mutation'] = {
  ...UserMutation,
  ...PermissionMutation,
};
