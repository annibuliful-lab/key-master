import { getUserPermissions } from './validate-authentication';
it('returns user permissions with project id', async () => {
  expect(
    await getUserPermissions({
      userId: 'TEST_USER_A_ID',
      projectId: 'TEST_PROJECT_ID',
      skipCache: true,
    })
  ).toMatchSnapshot();
});
