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

    it('updates an existing project role', async () => {
      const role = await createProjectRole({ client });
      const newRole = `MOCK_NEW_ROLE_${nanoid()}`;
      const updated = await client.chain.mutation
        .updateProjectRole({
          id: role.id,
          input: {
            role: newRole,
          },
        })
        .get({ id: true, role: true });

      expect(updated.id).toEqual(role.id);
      expect(updated.role).toEqual(newRole);
    });

    it('throws error when update wrong id', async () => {
      expect(
        client.chain.mutation.updateProjectRole({
          id: `MOCK_WRONG_ID_${nanoid()}`,
          input: {
            role: 'NEW',
          },
        })
      ).rejects.toBeTruthy();
    });
  });
});
