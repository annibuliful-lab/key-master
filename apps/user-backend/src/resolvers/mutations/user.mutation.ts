import { Resolvers } from '@key-master/graphql';
import { FastifyContext } from 'fastify';
import { IGraphqlContext } from '../../context';

export const mutation: Resolvers<IGraphqlContext<FastifyContext>>['Mutation'] =
  {
    createUser: (_parent, { input }, ctx) => {
      return ctx.user.createUser(input);
    },
  };
