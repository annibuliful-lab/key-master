import { Resolvers } from '@key-master/graphql';
import { FastifyContext } from 'fastify';
import { IGraphqlContext } from '../../context';

export const query: Resolvers<IGraphqlContext<FastifyContext>>['Query'] = {
  users: (_parent, _input, ctx) => {
    return ctx.user.findAll();
  },
};
