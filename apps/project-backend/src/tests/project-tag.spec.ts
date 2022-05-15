import {
  Client,
  createProjectTag,
  expectDuplicatedError,
  expectNotFoundError,
  projectOwnerAClient,
} from '@key-master/test';
import { nanoid } from 'nanoid';

describe('Project Tag', () => {
  let client: Client = null;

  beforeAll(() => {
    client = projectOwnerAClient;
  });

  describe('Mutation', () => {
    it('creats new project tag', async () => {
      const tag = `MOCK_PROJECT_TAG_${nanoid()}`;
      const createdTag = await client.chain.mutation
        .createProjectTag({
          input: {
            tag,
          },
        })
        .get({
          projectId: true,
          id: true,
          tag: true,
        });

      expect(tag).toEqual(createdTag.tag);
    });

    it('throws error when create duplicated tag', async () => {
      const tag = `MOCK_DUPLICATED_TAG_${nanoid()}`;
      await createProjectTag({
        client,
        tag,
      });

      expectDuplicatedError(
        client.chain.mutation
          .createProjectTag({
            input: {
              tag,
            },
          })
          .get({
            projectId: true,
            id: true,
            tag: true,
          })
      );
    });

    it('updates by id', async () => {
      const createdTag = await createProjectTag({
        client,
      });
      const newTag = `MOCK_NEW_TAG_${nanoid()}`;
      const updatedTag = await client.chain.mutation
        .updateProjectTag({
          id: createdTag.id,
          input: {
            tag: newTag,
          },
        })
        .get({
          id: true,
          tag: true,
        });

      expect(updatedTag.tag).toEqual(newTag);
      expect(updatedTag.id).toEqual(createdTag.id);
    });

    it('throws not found error when update with wrong id', () => {
      expectNotFoundError(
        client.chain.mutation
          .updateProjectTag({
            id: `MOCK_WRONG_PROJECT_TAG_ID_${nanoid()}`,
            input: {
              tag: `newTag`,
            },
          })
          .get({
            id: true,
            tag: true,
          })
      );
    });

    it('deletes by id', async () => {
      const createdTag = await createProjectTag({
        client,
      });
      expect(
        client.chain.mutation
          .deleteProjectTag({
            id: createdTag.id,
          })
          .success.get()
      ).resolves.toBeTruthy();
    });

    it('throws not found error when delete with wrong id', () => {
      expectNotFoundError(
        client.chain.mutation
          .deleteProjectTag({
            id: `MOCK_WRONG_PROJECT_ID_${nanoid()}`,
          })
          .success.get()
      );
    });
  });
});
