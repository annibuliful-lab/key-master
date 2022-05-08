import { Client } from '../generated';
import { createKeyManagement } from './key-management';
import { createProjectOrganization } from './project-organization';

interface ICreateOrganizationKeyManagementParam {
  client: Client;
  customKeyname?: string;
  orgId?: string;
}

export async function createOrganizationKeyManagement({
  client,
  customKeyname,
  orgId,
}: ICreateOrganizationKeyManagementParam) {
  const createdOrg = await createProjectOrganization({ client });
  const createdKey = await createKeyManagement({
    client,
    customName: customKeyname,
  });

  return client.chain.mutation
    .createOrganizationKeyManagement({
      input: {
        keyManagementId: createdKey.id,
        projectOrganizationId: orgId ?? createdOrg.id,
      },
    })
    .get({
      keyManagementId: true,
      id: true,
      projectOrganizationId: true,
    });
}
