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
  expect(permissions).toMatchSnapshot();
});
