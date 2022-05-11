import { PubSub } from 'graphql-subscriptions';
import { TopicDataStructure } from './topic-data';
import { PubSubTopic } from './topics';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { redisClient } from '@key-master/db';

let _pubsub: PubSub = null;

function getClient() {
  if (_pubsub) {
    return _pubsub;
  }

  _pubsub = new PubSub();
  return _pubsub;
}

const pubsub = getClient();
const redisPubsubClient = new RedisPubSub({
  subscriber: redisClient,
  publisher: redisClient,
});

export const createPublishEvent = <
  T extends keyof typeof PubSubTopic,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  E extends TopicDataStructure[T]
>(
  key: T,
  payload: E,
  pubsubEngine = pubsub
) => {
  return pubsubEngine.publish(key, payload);
};

export const createSubscriberEvent = <
  T extends keyof typeof PubSubTopic,
  E = unknown
>(
  topic: T | T[],
  pubsubEngine = pubsub
) => {
  return pubsubEngine.asyncIterator(topic) as unknown as
    | AsyncIterable<E>
    | Promise<AsyncIterable<E>>;
};

export const publishRedisEvent = <
  T extends keyof typeof PubSubTopic,
  P = unknown
>(
  key: T,
  payload: P
) => {
  return redisPubsubClient.publish(key, payload);
};

export const subscribeRedisEvent = <
  T extends keyof typeof PubSubTopic,
  E = unknown
>(
  topic: T | T[]
) => {
  return redisPubsubClient.asyncIterator(topic) as unknown as
    | AsyncIterable<E>
    | Promise<AsyncIterable<E>>;
};
