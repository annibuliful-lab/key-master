import { Resolvers } from '@key-master/graphql';
import { IGraphqlContext } from '../../context';

export const query: Resolvers<IGraphqlContext>['Query'] = {
  users: (_parent, _input, ctx) => {
    return ctx.user.findAll();
  },
  _userProfile: (parent, { keys }, ctx) => {
    console.log('keys', { keys, parent });
    return null;
  },
};
