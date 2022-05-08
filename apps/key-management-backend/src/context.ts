import { keyManagementDataLoader } from './dataloader/key-management.dataloader';
import { KeyManagementService } from './services/key-management.service';
import { OrganizationKeyManagementService } from './services/organization-key-management.service';

export interface IGraphqlContext {
  keyManagement: KeyManagementService;
  organizationKeyManagement: OrganizationKeyManagementService;
  keyManagementDataLoader: typeof keyManagementDataLoader;
}
