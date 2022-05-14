import { mongoClient } from '@key-master/db';
import { subscriberQueueClient } from '@key-master/queue';
import { UserActivityType } from '../codegen-generated';

type UserLoginData = {
  id: string;
  fullname: string;
  token: string;
  refreshToken: string;
};

export const userLoginSubscriberEvent = () =>
  subscriberQueueClient<UserLoginData>('USER_ACTIVITY', async (job) => {
    if (job.name === 'USER_LOGIN') {
      const jobData = job.data;
      await mongoClient.userActivity.create({
        data: {
          userId: jobData.id,
          serviceName: 'Authentication',
          data: jobData,
          type: 'READ',
        },
      });
      await job.remove();
      return;
    }
  });

type UserKeyManagementData = {
  name: string;
  userId: string;
  createdAt: string;
};

const getKeyManagementActivityByType = (type: string) => {
  switch (type) {
    case 'CREATE':
      return 'Create new a key management';
    case 'DELETE':
      return 'Delete a key management';
    case 'UPDATE':
      return 'Update a key management';
    case 'UPDATE_PIN':
      return 'Update a key management pin';
    default:
      '';
  }
};

export const userKeyManagementSubscriberEvent = () =>
  subscriberQueueClient<UserKeyManagementData>(
    'KEY_MANAGEMENT',
    async (job) => {
      const jobData = job.data;
      await mongoClient.userActivity.create({
        data: {
          userId: jobData.userId,
          description: getKeyManagementActivityByType(job.name),
          type: job.name as UserActivityType,
          serviceName: 'KeyManagement',
          data: {
            ...jobData,
            createdAt: jobData.createdAt,
          },
        },
      });
      await job.remove();
    }
  );
