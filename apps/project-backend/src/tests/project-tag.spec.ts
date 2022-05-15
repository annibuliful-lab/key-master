import {
  Client,
  createProjectTag,
  expectDuplicatedError,
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
  });
});
