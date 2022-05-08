import { Client } from '../generated';
import { createKeyManagement } from './key-management';
import { createProjectOrganization } from './project-organization';

interface ICreateOrganizationKeyManagementParam {
  client: Client;
}

export async function createOrganizationKeyManagement({
  client,
}: ICreateOrganizationKeyManagementParam) {
  const createdOrg = await createProjectOrganization({ client });
  const createdKey = await createKeyManagement({ client });

  return client.chain.mutation
    .createOrganizationKeyManagement({
      input: {
        keyManagementId: createdKey.id,
        projectOrganizationId: createdOrg.id,
      },
    })
    .get({
      keyManagementId: true,
      id: true,
      projectOrganizationId: true,
    });
}
