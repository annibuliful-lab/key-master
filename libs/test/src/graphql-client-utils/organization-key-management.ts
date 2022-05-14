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

interface ICreateOrganizationKeyManagementUserBookmarkParam {
  client: Client;
  customKeyName?: string;
}
export async function createOrganizationKeyManagementUserBookmark({
  client,
  customKeyName,
}: ICreateOrganizationKeyManagementUserBookmarkParam) {
  const key = await createKeyManagement({ client, customName: customKeyName });
  const createdBookmark = await client.chain.mutation
    .createOrganizationKeyManagementUserBookmark({
      input: {
        keyManagementId: key.id,
      },
    })
    .get({
      id: true,
      keyManagementId: true,
      userId: true,
      projectOrganizationId: true,
    });

  return createdBookmark;
}
