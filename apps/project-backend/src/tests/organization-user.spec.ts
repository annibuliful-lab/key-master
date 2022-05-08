import {
  Client,
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
  });
});
