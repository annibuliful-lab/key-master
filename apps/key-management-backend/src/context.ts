import { IAppContext } from '@key-master/graphql';
import { keyManagementDataLoader } from './dataloader/key-management.dataloader';
import { KeyManagementService } from './services/key-management.service';
import { OrganizationKeyManagementService } from './services/organization-key-management.service';

export interface IGraphqlContext extends IAppContext {
  keyManagement: KeyManagementService;
  organizationKeyManagement: OrganizationKeyManagementService;
  keyManagementDataLoader: typeof keyManagementDataLoader;
}
