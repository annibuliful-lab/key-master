import { redisClient } from '@key-master/db';
import { getUserPermissions } from './validate-authentication';
it('returns user permissions with project id', async () => {
  const permissions = await getUserPermissions({
    userId: 'TEST_USER_A_ID',
    projectId: 'TEST_PROJECT_ID',
    skipCache: true,
  });

  // fix jest detected redis client open handle
  redisClient.disconnect();

  expect(permissions.userId).toEqual('TEST_USER_A_ID');
  expect(permissions.role).toEqual('OWNER');
  expect(permissions.permissions).toEqual(
    expect.arrayContaining([
      'USER_WRITE',
      'USER_READ',
      'PROJECT_READ',
      'PROJECT_WRITE',
      'ROLE_READ',
      'ROLE_WRITE',
      'PROJECT_ROLE_READ',
      'PROJECT_ROLE_WRITE',
      'PROJECT_USER_READ',
      'PROJECT_USER_WRITE',
      'PERMISSION_READ',
      'PROJECT_DELETE',
      'PROJECT_ROLE_USER_WRITE',
      'PROJECT_ROLE_USER_READ',
      'PROJECT_ORGANIZATION_USER_READ',
      'PROJECT_ORGANIZATION_USER_WRITE',
      'PROJECT_ORGANIZATION_WRITE',
      'PROJECT_ORGANIZATION_READ',
      'PROJECT_ROLE_PERMISSION_WRITE',
      'PROJECT_ROLE_PERMISSION_READ',
      'ORGANIZATION_KEY_MANAGEMENT_WRITE',
      'ORGANIZATION_KEY_MANAGEMENT_READ',
      'KEY_MANAGEMENT_WRITE',
      'KEY_MANAGEMENT_READ',
      'KEY_MANAGEMENT_UPDATE_PIN',
      'USER_ACTIVITY_READ',
    ])
  );
});
