import {
  Client,
  createProjectRole,
  projectOwnerAClient,
} from '@key-master/test';
import { nanoid } from 'nanoid';

describe('Project Role', () => {
  let client: Client = null;
  beforeAll(() => {
    client = projectOwnerAClient;
  });

  describe('Mutation', () => {
    it('creates project role', async () => {
      const role = `MOCK_ROLE_${nanoid()}`;
      const projectRole = await client.chain.mutation
        .createProjectRole({
          input: {
            role,
          },
        })
        .role.get();
      expect(projectRole).toEqual(role);
    });

    it('throws error when create duplicate role', async () => {
      const role = `MOCK_ROLE_${nanoid()}`;
      await createProjectRole({ client, customRole: role });
      expect(
        client.chain.mutation
          .createProjectRole({
            input: {
              role,
            },
          })
          .role.get()
      ).rejects.toBeTruthy();
    });
  });
});
