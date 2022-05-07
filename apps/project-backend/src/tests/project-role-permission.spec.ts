import {
  Client,
  createPermission,
  createProjectRole,
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
      await client.chain.mutation
        .deletePermission({ id: deletePermissionId })
        .success.get();

      expect(
        client.chain.mutation
          .setProjectRolePermissions({
            input: {
              roleId,
              permissionIds,
            },
          })
          .get({ permissionId: true, roleId: true })
      ).rejects.toBeTruthy();
    });
  });
});
