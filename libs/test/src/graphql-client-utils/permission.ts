import { projectOwnerAClient } from '../graphql-client';
import { nanoid } from 'nanoid';

export function createPermission(customPermission?: string) {
  const permission = customPermission
    ? customPermission
    : `MOCK_PERMISSION_${nanoid()}`;
  return projectOwnerAClient.chain.mutation
    .createPermission({ permission })
    .get({ permission: true, id: true });
}
