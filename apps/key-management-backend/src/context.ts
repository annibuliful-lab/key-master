import { KeyManagementService } from './services/key-management.service';

export interface IGraphqlContext {
  keyManagement: KeyManagementService;
}
