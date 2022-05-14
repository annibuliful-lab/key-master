import {
  Client,
  createKeyManagement,
  createProjectOrganization,
  projectOwnerAClient,
  projectOwnerAClientWithOrganizationClient,
} from '@key-master/test';

describe('Organization User Key Bookmark', () => {
  describe('Mutation', () => {
    let client: Client = null;
    let organizationId: string = null;

    beforeAll(async () => {
      const organization = await createProjectOrganization({
        client: projectOwnerAClient,
      });
      organizationId = organization.id;
      client = projectOwnerAClientWithOrganizationClient(organization.id);
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
  });
});
