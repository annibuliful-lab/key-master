import { Resolvers } from '../../codegen-generated';
import { mutations as UserActivityMutation } from './user-activity.mutation';

export const mutations: Resolvers['Mutation'] = {
  ...UserActivityMutation,
};
