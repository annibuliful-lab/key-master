import {
  adminOwnerClient,
  Client,
  createPermission,
  createProjectRole,
  expectNotFoundError,
  projectOwnerAClient,
} from '@key-master/test';

describe('Project Role Permission', () => {
  let client: Client = null;
  beforeAll(() => {
    client = projectOwnerAClient;
  });

  describe('Mutation', () => {
    let permissionIds: string[];
    let roleId: string;
    beforeEach(async () => {
      permissionIds = (
        await Promise.all([createPermission(), createPermission()])
      ).map((p) => p.id);
      roleId = (await createProjectRole({ client })).id;
    });

    it('sets permissions to project role', async () => {
      const result = await client.chain.mutation
        .setProjectRolePermissions({
          input: {
            roleId,
            permissionIds,
          },
        })
        .get({ permissionId: true, roleId: true });

      expect(
        result.every(
          (role) =>
            role.roleId === roleId && permissionIds.includes(role.permissionId)
        )
      ).toBeTruthy();
    });

    it('throws error when assign with array that contains deleted permissions', async () => {
      const deletePermissionId = permissionIds[0];
      await adminOwnerClient.chain.mutation
        .deletePermission({ id: deletePermissionId })
        .success.get();

      expectNotFoundError(
        client.chain.mutation
          .setProjectRolePermissions({
            input: {
              roleId,
              permissionIds,
            },
          })
          .get({ permissionId: true, roleId: true })
      );
    });
  });

  describe('Query', () => {
    let permissionIds: string[];
    let roleId: string;
    beforeEach(async () => {
      permissionIds = (
        await Promise.all([
          createPermission('CUSTOM_PERMISSION_A'),
          createPermission('CUSTOM_PERMISSION_B'),
        ])
      ).map((p) => p.id);
      roleId = (await createProjectRole({ client })).id;
    });

    it('gets by role id', async () => {
      await client.chain.mutation
        .setProjectRolePermissions({
          input: {
            roleId,
            permissionIds,
          },
        })
        .get({ permissionId: true, roleId: true });

      const rolePermissions = await client.chain.query
        .getProjectRolePermissionsByRoleId({
          id: roleId,
        })
        .get({
          permission: {
            id: true,
            permission: true,
          },
          roleId: true,
        });

      const permissions = rolePermissions.flatMap(
        (p) => p.permission.permission
      );

      const permisionIds = rolePermissions.flatMap((p) => p.permission.id);
      expect(
        permisionIds.every((id) => permisionIds.includes(id))
      ).toBeTruthy();
      expect(
        permissions.every((p) =>
          ['CUSTOM_PERMISSION_A', 'CUSTOM_PERMISSION_B'].includes(p)
        )
      ).toBeTruthy();
    });
  });
});
