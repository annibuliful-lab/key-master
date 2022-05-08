import {
  Client,
  createOrganizationUser,
  createProjectOrganization,
  createProjectRoleUser,
  projectOwnerAClient,
} from '@key-master/test';
import { nanoid } from 'nanoid';

describe('Organization User', () => {
  let client: Client = null;

  beforeAll(() => {
    client = projectOwnerAClient;
  });

  describe('Mutation', () => {
    it('creates new organization user', async () => {
      const organization = await createProjectOrganization({ client });
      const projectRoleUser = await createProjectRoleUser({ client });

      const organizationUser = await client.chain.mutation
        .createOrganizationUser({
          input: {
            organizationId: organization.id,
            userId: projectRoleUser.userId,
          },
        })
        .get({
          organizationId: true,
          userId: true,
        });

      expect(organizationUser.userId).toEqual(projectRoleUser.userId);
      expect(organizationUser.organizationId).toEqual(organization.id);
    });

    it('throws error when create with wrong organization id', () => {
      expect(
        client.chain.mutation
          .createOrganizationUser({
            input: {
              organizationId: `MOCK_WRONG_ORGANIZATION_ID_${nanoid()}`,
              userId: `MOCK_WRONG_USER_ID_${nanoid()}`,
            },
          })
          .get({
            organizationId: true,
            userId: true,
          })
      ).rejects.toBeTruthy();
    });

    it('throws error when create with wrong user id', async () => {
      const organization = await createProjectOrganization({ client });

      expect(
        client.chain.mutation
          .createOrganizationUser({
            input: {
              organizationId: organization.id,
              userId: `MOCK_WRONG_USER_ID_${nanoid()}`,
            },
          })
          .get({
            organizationId: true,
            userId: true,
          })
      ).rejects.toBeTruthy();
    });

    it('updates correctly', async () => {
      const organizationUser = await createOrganizationUser({ client });
      const updated = await client.chain.mutation
        .updateOrganizationUser({
          id: organizationUser.id,
          input: {
            active: false,
          },
        })
        .get({ id: true, active: true });

      expect(updated.id).toEqual(organizationUser.id);
      expect(updated.active).toBeFalsy();
    });

    it('throws error when update with wrong id', () => {
      expect(
        client.chain.mutation
          .updateOrganizationUser({
            id: `MOCK_WRONG_ORGANIZATION_ID_${nanoid()}`,
            input: {
              active: false,
            },
          })
          .get({ id: true, active: true })
      ).rejects.toBeTruthy();
    });

    it('throws error when update with deleted id', async () => {
      const organizationUser = await createOrganizationUser({ client });
      await client.chain.mutation
        .deleteOrganizationUser({
          id: organizationUser.id,
        })
        .success.get();

      expect(
        client.chain.mutation
          .updateOrganizationUser({
            id: organizationUser.id,
            input: {
              active: false,
            },
          })
          .get({ id: true, active: true })
      ).rejects.toBeTruthy();
    });

    it('deletes correct id', async () => {
      const organizationUser = await createOrganizationUser({ client });
      const getBeforeDelete = await client.chain.query
        .getOrganizationUserById({
          id: organizationUser.id,
        })
        .get({ organizationId: true, userId: true, id: true });

      const result = await client.chain.mutation
        .deleteOrganizationUser({
          id: organizationUser.id,
        })
        .success.get();

      expect(
        client.chain.query
          .getOrganizationUserById({
            id: organizationUser.id,
          })
          .get({ organizationId: true, userId: true, id: true })
      ).rejects.toBeTruthy();

      expect(result).toBeTruthy();
      expect(organizationUser.id).toEqual(getBeforeDelete.id);
    });

    it('throws error when delete wrong id', async () => {
      expect(
        client.chain.mutation
          .deleteOrganizationUser({
            id: `MOCK_WRONG_DELETE_ORG_USER_${nanoid()}`,
          })
          .success.get()
      ).rejects.toBeTruthy();
    });
  });

  describe('Query', () => {
    it('gets by id', async () => {
      const organizationUser = await createOrganizationUser({ client });
      const result = await client.chain.query
        .getOrganizationUserById({
          id: organizationUser.id,
        })
        .get({
          organizationId: true,
          userId: true,
          id: true,
          organization: {
            id: true,
            projectId: true,
          },
        });

      expect(result.organization.id).toEqual(organizationUser.organizationId);
      expect(result.organization.projectId).toBeDefined();
      expect(result.organizationId).toEqual(organizationUser.organizationId);
      expect(result.userId).toEqual(organizationUser.userId);
      expect(result.id).toEqual(organizationUser.id);
    });

    it('throws error by wrong id', () => {
      expect(
        client.chain.query
          .getOrganizationUserById({
            id: `MOCK_WRONG_ORG_USER_${nanoid()}`,
          })
          .get({ organizationId: true, userId: true, id: true })
      ).rejects.toBeTruthy();
    });

    it('returns organization users', async () => {
      const projectOrganization = await createProjectOrganization({ client });

      await Promise.all([
        createOrganizationUser({
          client,
          customOrganizationId: projectOrganization.id,
        }),
        createOrganizationUser({
          client,
          customOrganizationId: projectOrganization.id,
        }),
      ]);
      const organizationUsers = await client.chain.query
        .getOrganizationUsers({
          filter: {
            organizationId: projectOrganization.id,
          },
        })
        .get({ id: true, organizationId: true, userId: true });
      expect(organizationUsers.length).toBeGreaterThanOrEqual(2);
    });

    it('returns organization users with limit', async () => {
      const projectOrganization = await createProjectOrganization({ client });

      await Promise.all([
        createOrganizationUser({
          client,
          customOrganizationId: projectOrganization.id,
        }),
        createOrganizationUser({
          client,
          customOrganizationId: projectOrganization.id,
        }),
      ]);
      const organizationUsers = await client.chain.query
        .getOrganizationUsers({
          filter: {
            organizationId: projectOrganization.id,
            take: 1,
          },
        })
        .get({ id: true, organizationId: true, userId: true });
      expect(organizationUsers.length).toEqual(1);
    });
  });
});
