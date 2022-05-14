import { redisClient } from '@key-master/db';
import { Queue, Worker, Processor } from 'bullmq';
import { QueueTopic } from './constants';

export const publisherQueueClient = (
  name: keyof typeof QueueTopic,
  connection = redisClient
) => {
  return new Queue(name, { connection });
};

export const subscriberQueueClient = <T, R = void>(
  name: keyof typeof QueueTopic,
  process: Processor<T, R>,
  connection = redisClient
) => {
  return new Worker(name, process, { connection });
};

export const userActivityPublisherQueueClient =
  publisherQueueClient('USER_ACTIVITY');

export const userActivityKeyManagementQueueClient =
  publisherQueueClient('KEY_MANAGEMENT');
