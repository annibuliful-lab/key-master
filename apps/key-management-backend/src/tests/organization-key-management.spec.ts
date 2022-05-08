import {
  Client,
  createKeyManagement,
  createOrganizationKeyManagement,
  createProjectOrganization,
  projectOwnerAClient,
} from '@key-master/test';
import { nanoid } from 'nanoid';

describe('Organization Key Management', () => {
  let client: Client = null;

  beforeAll(() => {
    client = projectOwnerAClient;
  });
  describe('Mutation', () => {
    it('creates new', async () => {
      const createdKey = await createKeyManagement({ client });
      const createdOrg = await createProjectOrganization({ client });

      const result = await client.chain.mutation
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

      expect(result.id).toBeDefined();
      expect(result.keyManagementId).toEqual(createdKey.id);
      expect(result.projectOrganizationId).toEqual(createdOrg.id);
    });

    it('throws error when create with wrong organization id', async () => {
      const createdKey = await createKeyManagement({ client });
      expect(
        client.chain.mutation
          .createOrganizationKeyManagement({
            input: {
              keyManagementId: createdKey.id,
              projectOrganizationId: `MOCK_WRONG_PROJECT_ORG_ID_${nanoid()}`,
            },
          })
          .get({
            keyManagementId: true,
            id: true,
            projectOrganizationId: true,
          })
      ).rejects.toBeTruthy();
    });

    it('throws error when create with correct organization id but wrong id', async () => {
      const createdOrg = await createProjectOrganization({ client });

      expect(
        client.chain.mutation
          .createOrganizationKeyManagement({
            input: {
              keyManagementId: `MOCK_WRONG_KEY_ID_${nanoid()}`,
              projectOrganizationId: createdOrg.id,
            },
          })
          .get({
            keyManagementId: true,
            id: true,
            projectOrganizationId: true,
          })
      ).rejects.toBeTruthy();
    });

    it('updates an existing org key management', async () => {
      const createdOrgKey = await createOrganizationKeyManagement({ client });
      expect(
        client.chain.mutation
          .updateOrganizationKeyManagement({
            id: createdOrgKey.id,
            input: {
              active: false,
            },
          })
          .active.get()
      ).toBeFalsy();
    });

    it('throws error when update wrong id', async () => {
      expect(
        client.chain.mutation
          .updateOrganizationKeyManagement({
            id: `MOCK_WRONG_ORG_KEY_ID_${nanoid()}`,
            input: {
              active: false,
            },
          })
          .active.get()
      ).rejects.toBeTruthy();
    });
  });
});
