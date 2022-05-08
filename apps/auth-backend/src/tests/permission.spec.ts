import { Client, createPermission, graphqlClient } from '@key-master/test';
import { nanoid } from 'nanoid';

describe('Permission', () => {
  let client: Client = null;

  beforeAll(() => {
    client = graphqlClient;
  });

  describe('Mutation', () => {
    it('creates new permission', async () => {
      const permission = `MOCK_PERMISSION_${nanoid()}`;
      const newPermission = await client.chain.mutation
        .createPermission({ permission })
        .permission.get();
      expect(newPermission).toEqual(permission);
    });

    it('updates an existing by id', async () => {
      const newPermissionId = (await createPermission()).id;
      const newPermissionName = `MOCK_NEW_PERMISSION_${nanoid()}`;
      const updatedPermission = await client.chain.mutation
        .updatePermission({
          id: newPermissionId,
          permission: newPermissionName,
        })
        .permission.get();
      expect(updatedPermission).toEqual(newPermissionName);
    });
    it('throws error when update wrong id', async () => {
      try {
        await client.chain.mutation
          .updatePermission({ id: `WRONG_ID_${nanoid()}`, permission: 'NEW' })
          .permission.get();
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('delets an existing', async () => {
      const newPermissionId = (await createPermission()).id;
      const permissionBeforeDelete = await client.chain.query
        .getPermissionById({ id: newPermissionId })
        .id.get();
      expect(permissionBeforeDelete).toEqual(newPermissionId);
      await client.chain.mutation
        .deletePermission({ id: newPermissionId })
        .success.get();
      expect(
        client.chain.query.getPermissionById({ id: newPermissionId }).id.get()
      ).rejects.toBeTruthy();
    });
  });

  describe('Query', () => {
    it('gets by id', async () => {
      const newPermission = await createPermission();
      const getPermission = await client.chain.query
        .getPermissionById({ id: newPermission.id })
        .get({ id: true, permission: true });
      expect(newPermission).toEqual(getPermission);
    });

    it('throws error when get by deleted id', async () => {
      const newPermission = await createPermission();
      await client.chain.mutation
        .deletePermission({ id: newPermission.id })
        .success.get();

      expect(
        client.chain.query.getPermissionById({ id: newPermission.id }).id.get()
      ).rejects.toBeTruthy();
    });

    it('throws error when get by wrong id', () => {
      expect(
        client.chain.query
          .getPermissionById({ id: `WRONG_ID_${nanoid()}` })
          .id.get()
      ).rejects.toBeTruthy();
    });

    it('returns permissions', async () => {
      await Promise.all([createPermission(), createPermission()]);
      const permissions = await client.chain.query
        .getPermissions({})
        .get({ id: true, permission: true });
      expect(permissions.length).toBeGreaterThanOrEqual(2);
    });

    it('returns permissions with limit', async () => {
      await Promise.all([createPermission(), createPermission()]);
      const permissions = await client.chain.query
        .getPermissions({ filter: { take: 1 } })
        .get({ id: true, permission: true });
      expect(permissions).toHaveLength(1);
    });

    it('returns permission that contain search text', async () => {
      await Promise.all([
        createPermission(`SEARCH_TEXT_${nanoid()}`),
        createPermission(`SEARCH_TEXT_${nanoid()}`),
      ]);
      const permissions = await client.chain.query
        .getPermissions({ filter: { search: 'search_text' } })
        .get({ id: true, permission: true });
      expect(
        permissions.every((permision) =>
          permision.permission.includes('SEARCH_TEXT_')
        )
      ).toBeTruthy();
    });

    it('returns permissions that contain search text and limit', async () => {
      await Promise.all([
        createPermission(`SEARCH_TEXT_WITH_LIMIT_${nanoid()}`),
        createPermission(`SEARCH_TEXT_WITH_LIMIT_${nanoid()}`),
      ]);
      const permissions = await client.chain.query
        .getPermissions({
          filter: { take: 1, search: 'search_text_with_limit' },
        })
        .get({ id: true, permission: true });

      expect(permissions).toHaveLength(1);
      expect(
        permissions.every((permision) =>
          permision.permission.includes('SEARCH_TEXT_')
        )
      ).toBeTruthy();
    });

    it('returns permissiosn with cursor', async () => {
      const [cursor] = await Promise.all([
        createPermission(),
        createPermission(),
      ]);
      const permissions = await client.chain.query
        .getPermissions({
          filter: { cursor: cursor.id },
        })
        .get({ id: true, permission: true });

      expect(permissions.every((p) => p.id !== cursor.id)).toBeTruthy();
    });
  });
});
