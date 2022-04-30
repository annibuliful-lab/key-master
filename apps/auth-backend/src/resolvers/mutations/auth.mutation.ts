import { Authentication, Resolvers } from '@key-master/graphql';
import { IGraphqlContext } from '../../context';

export const mutation: Resolvers<IGraphqlContext>['Mutation'] = {
  login: (_parent, { input }, ctx) => {
    return ctx.auth.login(input) as unknown as Authentication;
  },
};
