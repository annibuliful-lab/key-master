import { redisClient } from '@key-master/db';
import { Queue, Worker, Processor } from 'bullmq';

export const publisherQueueClient = (
  name: string,
  connection = redisClient
) => {
  return new Queue(name, { connection });
};

export const subsciberQueueClient = <T, R = void>(
  name: string,
  process: Processor<T, R>,
  connection = redisClient
) => {
  return new Worker(name, process, { connection });
};
