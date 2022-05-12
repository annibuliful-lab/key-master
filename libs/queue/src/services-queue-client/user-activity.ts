import { publisherQueueClient } from '../queue-client';

export const userActivityPublisherQueueClient =
  publisherQueueClient('USER_ACTIVITY');
