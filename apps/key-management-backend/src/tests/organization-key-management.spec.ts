import {
  Client,
  createKeyManagement,
  createOrganizationKeyManagement,
  createProjectOrganization,
  expectNotFoundError,
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

      expectNotFoundError(
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
      );
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
      ).resolves.toBeFalsy();
    });

    it('throws error when update wrong id', async () => {
      expectNotFoundError(
        client.chain.mutation
          .updateOrganizationKeyManagement({
            id: `MOCK_WRONG_ORG_KEY_ID_${nanoid()}`,
            input: {
              active: false,
            },
          })
          .active.get()
      );
    });
  });

  describe('Query', () => {
    it('gets by id', async () => {
      const createdOrgKey = await createOrganizationKeyManagement({ client });
      const result = await client.chain.query
        .getOrganizationKeyManagementById({ id: createdOrgKey.id })
        .get({
          id: true,
          keyManagement: {
            id: true,
            name: true,
          },
          projectOrganization: {
            id: true,
            name: true,
          },
        });

      expect(result.keyManagement.id).toEqual(createdOrgKey.keyManagementId);
      expect(result.keyManagement.name).toBeDefined();
      expect(result.projectOrganization.id).toEqual(
        createdOrgKey.projectOrganizationId
      );
      expect(result.projectOrganization.name).toBeDefined();
      expect(result.id).toEqual(createdOrgKey.id);
    });

    it('throws error when get by wrong id', () => {
      expectNotFoundError(
        client.chain.query
          .getOrganizationKeyManagementById({
            id: `MOCK_WRONG_ORG_KEY_ID_${nanoid()}`,
          })
          .id.get()
      );
    });

    it('returns organization keys', async () => {
      const orgId = (await createProjectOrganization({ client })).id;
      const [createdOrgKey] = await Promise.all([
        createOrganizationKeyManagement({ client, orgId }),
        createOrganizationKeyManagement({ client, orgId }),
        createOrganizationKeyManagement({ client, orgId }),
      ]);

      const orgKeys = await client.chain.query
        .getOrganizationKeyManagements({
          filter: {
            organizationId: createdOrgKey.projectOrganizationId,
          },
        })
        .get({
          id: true,
          keyManagementId: true,
          projectOrganizationId: true,
          active: true,
        });

      expect(orgKeys).toHaveLength(3);
    });

    it('returns organization keys with limit', async () => {
      const orgId = (await createProjectOrganization({ client })).id;

      const [createdOrgKey] = await Promise.all([
        createOrganizationKeyManagement({ client, orgId }),
        createOrganizationKeyManagement({ client, orgId }),
        createOrganizationKeyManagement({ client, orgId }),
      ]);

      const orgKeys = await client.chain.query
        .getOrganizationKeyManagements({
          filter: {
            take: 1,
            organizationId: createdOrgKey.projectOrganizationId,
          },
        })
        .get({
          id: true,
          keyManagementId: true,
          projectOrganizationId: true,
          projectOrganization: {
            id: true,
          },
          active: true,
        });

      expect(
        orgKeys.every((org) => org.projectOrganization.id === orgId)
      ).toBeTruthy();

      expect(orgKeys).toHaveLength(1);
    });
  });

  it('returns by seach key name', async () => {
    const orgId = (await createProjectOrganization({ client })).id;

    const [createdOrgKey] = await Promise.all([
      createOrganizationKeyManagement({
        client,
        orgId,
        customKeyname: `SEARCH_ORG_KEY_${nanoid()}`,
      }),
      createOrganizationKeyManagement({
        client,
        orgId,
        customKeyname: `SEARCH_O_KEY_${nanoid()}`,
      }),
    ]);

    const orgKeys = await client.chain.query
      .getOrganizationKeyManagements({
        filter: {
          organizationId: createdOrgKey.projectOrganizationId,
          search: 'search_org_key',
        },
      })
      .get({
        id: true,
        keyManagementId: true,
        projectOrganizationId: true,
        active: true,
      });

    expect(orgKeys).toHaveLength(1);
  });
});
