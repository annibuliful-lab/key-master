import {
  Client,
  createProjectRole,
  expectDuplicatedError,
  expectNotFoundError,
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
      expectDuplicatedError(
        client.chain.mutation
          .createProjectRole({
            input: {
              role,
            },
          })
          .role.get()
      );
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
      expectNotFoundError(
        client.chain.mutation
          .updateProjectRole({
            id: `MOCK_WRONG_ID_${nanoid()}`,
            input: {
              role: 'NEW',
            },
          })
          .id.get()
      );
    });

    it('deletes an existing', async () => {
      const role = await createProjectRole({ client });
      expect(
        client.chain.mutation
          .deleteProjectRole({
            id: role.id,
          })
          .success.get()
      ).toBeTruthy();
    });

    it('throws error when delete wrong id', async () => {
      expectNotFoundError(
        client.chain.mutation
          .deleteProjectRole({
            id: 'MOCK_ROLE_ID',
          })
          .success.get()
      );
    });
  });

  describe('Query', () => {
    it('gets by id', async () => {
      const role = await createProjectRole({ client });

      expect(
        client.chain.query.getProjectRoleById({ id: role.id }).id.get()
      ).resolves.toEqual(role.id);
    });

    it('throws error when gets with wrong id', async () => {
      expectNotFoundError(
        client.chain.query
          .getProjectRoleById({ id: `WRONG_ROLE_ID_${nanoid()}` })
          .id.get()
      );
    });

    it('throws error when gets with deleted wrong id', async () => {
      const createdRole = await createProjectRole({ client });
      const roleBeforeDelete = await client.chain.query
        .getProjectRoleById({ id: createdRole.id })
        .id.get();

      await client.chain.mutation
        .deleteProjectRole({
          id: createdRole.id,
        })
        .success.get();

      expect(roleBeforeDelete).toEqual(createdRole.id);
      expectNotFoundError(
        client.chain.query.getProjectRoleById({ id: createdRole.id }).id.get()
      );
    });

    it('gets by project id', async () => {
      const createdRole = await createProjectRole({ client });
      const projectRoles =
        await client.chain.query.getProjectRolesByProject.get({
          id: true,
          role: true,
        });

      expect(
        projectRoles.some((role) => role.role === createdRole.role)
      ).toBeTruthy();
    });
  });
});
