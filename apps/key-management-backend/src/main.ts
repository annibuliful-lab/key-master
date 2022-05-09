import { createServer } from '@key-master/graphql';
import { resolvers } from './resolvers';
import { typeDefs } from './schemas';
import * as dotenv from 'dotenv';
import { IGraphqlContext } from './context';
import { KeyManagementService } from './services/key-management.service';
import { OrganizationKeyManagementService } from './services/organization-key-management.service';
import { keyManagementDataLoader } from './dataloader/key-management.dataloader';

dotenv.config();

createServer({
  typeDefs,
  port: 3003,
  resolvers,
  contextResolver: (context): IGraphqlContext => {
    return {
      ...context,
      keyManagement: new KeyManagementService(context),
      organizationKeyManagement: new OrganizationKeyManagementService(context),
      keyManagementDataLoader,
    };
  },
});
