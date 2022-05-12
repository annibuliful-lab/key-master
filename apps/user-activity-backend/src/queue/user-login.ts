import { mongoClient } from '@key-master/db';
import { subscriberQueueClient } from '@key-master/queue';
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
          serviceName: 'Auth',
          data: jobData,
          type: 'READ',
        },
      });
      return;
    }
  });
