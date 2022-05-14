import {
  Client,
  createKeyManagement,
  createProjectOrganization,
  expectForbiddenError,
  expectNotFoundError,
  projectOwnerAClient,
  projectOwnerAClientWithOrganizationClient,
  userBClient,
} from '@key-master/test';
import { nanoid } from 'nanoid';

describe('Organization User Key Bookmark', () => {
  describe('Mutation', () => {
    let client: Client = null;
    let organizationId: string = null;

    beforeAll(async () => {
      const organization = await createProjectOrganization({
        client: projectOwnerAClient,
      });
      organizationId = organization.id;
      client = projectOwnerAClientWithOrganizationClient({
        orgId: organization.id,
      });
    });

    it('creates new key bookmark', async () => {
      const key = await createKeyManagement({ client });
      const createdBookmark = await client.chain.mutation
        .createOrganizationKeyManagementUserBookmark({
          input: {
            keyManagementId: key.id,
          },
        })
        .get({
          keyManagementId: true,
          userId: true,
          projectOrganizationId: true,
        });

      expect(createdBookmark.projectOrganizationId).toEqual(organizationId);
      expect(createdBookmark.keyManagementId).toEqual(key.id);
    });

    it('throws error when create new key with wrong org id', async () => {
      const key = await createKeyManagement({ client });
      const clientWithWrongId = projectOwnerAClientWithOrganizationClient({
        orgId: `MOCK_WRONG_ORG_ID_${nanoid()}`,
      });
      expectNotFoundError(
        clientWithWrongId.chain.mutation
          .createOrganizationKeyManagementUserBookmark({
            input: {
              keyManagementId: key.id,
            },
          })
          .id.get()
      );
    });

    it('throws forbidden error when create new key with orrect org id but wrong user id', async () => {
      const key = await createKeyManagement({ client });
      const wrongUserClient = userBClient(organizationId);

      expectForbiddenError(
        wrongUserClient.chain.mutation
          .createOrganizationKeyManagementUserBookmark({
            input: {
              keyManagementId: key.id,
            },
          })
          .id.get()
      );
    });

    it('it throws error when create new key with deleted organization', async () => {
      const organization = await createProjectOrganization({
        client: projectOwnerAClient,
      });

      await projectOwnerAClient.chain.mutation
        .deleteProjectOrganization({
          id: organization.id,
        })
        .success.get();
      const key = await createKeyManagement({ client });
      const newClient = projectOwnerAClientWithOrganizationClient({
        orgId: organization.id,
      });

      expectNotFoundError(
        newClient.chain.mutation
          .createOrganizationKeyManagementUserBookmark({
            input: {
              keyManagementId: key.id,
            },
          })
          .id.get()
      );
    });
  });
});
