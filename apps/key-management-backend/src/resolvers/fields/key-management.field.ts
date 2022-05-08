import { Resolvers } from '../../codegen-generated';
import { IGraphqlContext } from '../../context';

export const resolvers: Resolvers<IGraphqlContext> = {
  KeyManagement: {
    masterKey: (parent, { pin }, ctx) => {
      return ctx.keyManagement.getMasterKey(parent.id, pin);
    },
  },
};
