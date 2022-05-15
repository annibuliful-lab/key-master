import { mongoClient } from '../client';

export async function createUserActivity() {
  const createUserActivity = await mongoClient.userActivity.create({
    data: {
      projectId: 'TEST_PROJECT_ID',
      serviceName: 'KeyManagement',
      parentPkId: 'KEY_MANAGEMENT_A_ID',
      type: 'CREATE',
      userId: 'TEST_USER_ID',
      data: {
        name: 'TEST_KEY_A',
      },
      description: 'Create Key name',
    },
  });

  console.log('create user activity', { createUserActivity });
}
