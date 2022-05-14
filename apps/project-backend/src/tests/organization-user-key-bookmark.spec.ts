import {
  Client,
  createKeyManagement,
  createOrganizationKeyManagementUserBookmark,
  createProjectOrganization,
  expectForbiddenError,
  expectNotFoundError,
  projectOwnerAClient,
  projectOwnerAClientWithOrganizationClient,
  userBClient,
} from '@key-master/test';
import { nanoid } from 'nanoid';

describe('Organization User Key Bookmark', () => {
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

  describe('Mutation', () => {
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

    it('deletes correct it', async () => {
      const createdBookmark = await createOrganizationKeyManagementUserBookmark(
        { client }
      );
      const beforeDelete = await client.chain.query
        .getOrganizationKeyManagementUserBookmarkById({
          id: createdBookmark.id,
        })
        .get({ id: true });
      const successDelete = await client.chain.mutation
        .deletedOrganizationKeyManagementUserBookmark({
          id: createdBookmark.id,
        })
        .success.get();
      expect(createdBookmark.id).toEqual(beforeDelete.id);
      expect(successDelete).toBeTruthy();
      expectNotFoundError(
        client.chain.query
          .getOrganizationKeyManagementUserBookmarkById({
            id: createdBookmark.id,
          })
          .id.get()
      );
    });

    it('throw not found error when delete wrong id', () => {
      expectNotFoundError(
        client.chain.query
          .getOrganizationKeyManagementUserBookmarkById({
            id: `MOCK_WRONG_BOOKMARK_ID_${nanoid()}`,
          })
          .id.get()
      );
    });
  });

  describe('Query', () => {
    it('gets by id', async () => {
      const createdBookmark = await createOrganizationKeyManagementUserBookmark(
        { client }
      );
      const getResultId = await client.chain.query
        .getOrganizationKeyManagementUserBookmarkById({
          id: createdBookmark.id,
        })
        .id.get();
      expect(getResultId).toEqual(createdBookmark.id);
    });

    it('throws not found error when get with wrong id', () => {
      expectNotFoundError(
        client.chain.query
          .getOrganizationKeyManagementUserBookmarkById({
            id: `MOCK_WRONG_BOOKMARK_ID_${nanoid()}`,
          })
          .id.get()
      );
    });

    it('throws not found error when get with deleted id', async () => {
      const createdBookmark = await createOrganizationKeyManagementUserBookmark(
        { client }
      );

      await client.chain.mutation
        .deletedOrganizationKeyManagementUserBookmark({
          id: createdBookmark.id,
        })
        .success.get();

      expectNotFoundError(
        client.chain.query
          .getOrganizationKeyManagementUserBookmarkById({
            id: createdBookmark.id,
          })
          .id.get()
      );
    });

    it('throws forbidden error when not owner', async () => {
      const createdBookmark = await createOrganizationKeyManagementUserBookmark(
        { client }
      );

      const wrongUserClient = userBClient(
        createdBookmark.projectOrganizationId
      );

      expectForbiddenError(
        wrongUserClient.chain.query
          .getOrganizationKeyManagementUserBookmarkById({
            id: createdBookmark.id,
          })
          .id.get()
      );
    });

    it('returns bookmarks list', async () => {
      const organization = await createProjectOrganization({
        client: projectOwnerAClient,
      });
      organizationId = organization.id;
      client = projectOwnerAClientWithOrganizationClient({
        orgId: organization.id,
      });
      await Promise.all([
        createOrganizationKeyManagementUserBookmark({ client }),
        createOrganizationKeyManagementUserBookmark({ client }),
        createOrganizationKeyManagementUserBookmark({ client }),
      ]);

      const bookmarks = await client.chain.query
        .getOrganizationKeyManagementUserBookmarks({})
        .get({ id: true, keyManagementId: true, projectOrganizationId: true });

      expect(bookmarks.length).toBeGreaterThanOrEqual(3);
    });

    it('returns bookmarks with limit', async () => {
      const organization = await createProjectOrganization({
        client: projectOwnerAClient,
      });
      organizationId = organization.id;
      client = projectOwnerAClientWithOrganizationClient({
        orgId: organization.id,
      });
      await Promise.all([
        createOrganizationKeyManagementUserBookmark({ client }),
        createOrganizationKeyManagementUserBookmark({ client }),
        createOrganizationKeyManagementUserBookmark({ client }),
      ]);
      const bookmarks = await client.chain.query
        .getOrganizationKeyManagementUserBookmarks({
          filter: {
            take: 2,
          },
        })
        .get({ id: true, keyManagementId: true, projectOrganizationId: true });
      expect(bookmarks).toHaveLength(2);
    });

    it('returns bookmarks with organization id', async () => {
      const organization = await createProjectOrganization({
        client: projectOwnerAClient,
      });
      organizationId = organization.id;
      client = projectOwnerAClientWithOrganizationClient({
        orgId: organization.id,
      });
      await Promise.all([
        createOrganizationKeyManagementUserBookmark({ client }),
        createOrganizationKeyManagementUserBookmark({ client }),
        createOrganizationKeyManagementUserBookmark({ client }),
      ]);
      const bookmarks = await client.chain.query
        .getOrganizationKeyManagementUserBookmarks({
          filter: {
            take: 2,
            organizationId: organization.id,
          },
        })
        .get({ id: true, keyManagementId: true, projectOrganizationId: true });

      expect(
        bookmarks.every((b) => b.projectOrganizationId === organization.id)
      ).toBeTruthy();
      expect(bookmarks).toHaveLength(2);
    });
  });
});
