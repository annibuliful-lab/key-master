import { mongoClient } from '../client';

export async function createUserActivity() {
  const createUserActivity = await mongoClient.userActivity.create({
    data: {
      projectId: 'TEST_PROJECT_ID',
      serviceName: 'TEST_SERVICE_NAME',
      parentPkId: 'MOCK_PARENT_ID',
      type: 'CREATE',
      userId: 'TEST_USER_ID',
      data: {
        fullname: 'TEST_NAME',
        id: 'TEST_ID',
      },
      description: 'TEST_DESCRIPTION',
    },
  });

  console.log('create user activity', { createUserActivity });
}
