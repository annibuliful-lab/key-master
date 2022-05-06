import { Client, graphqlClient } from '@key-master/test';
import { nanoid } from 'nanoid';

describe('Permission', () => {
  let client: Client = null;

  beforeAll(() => {
    client = graphqlClient;
  });

  function createPermission(customPermission?: string) {
    const permission = customPermission
      ? customPermission
      : `MOCK_PERMISSION_${nanoid()}`;
    return client.chain.mutation
      .createPermission({ permission })
      .get({ permission: true, id: true });
  }

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
    it('throws error when get by wrong id', () => {
      expect(
        client.chain.query
          .getPermissionById({ id: `WRONG_ID_${nanoid()}` })
          .id.get()
      ).rejects.toBeTruthy();
    });
  });
});
