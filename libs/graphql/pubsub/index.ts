import { PubSub } from 'graphql-subscriptions';
import { TopicDataStructure } from './topic-data';
import { PubSubTopic } from './topics';

let _pubsub: PubSub = null;

function getClient() {
  if (_pubsub) {
    return _pubsub;
  }

  _pubsub = new PubSub();
  return _pubsub;
}

export const pubsub = getClient();

export const createPublishEvent = <
  T extends keyof typeof PubSubTopic,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  E extends TopicDataStructure[T]
>(
  key: T,
  payload: E
) => {
  return pubsub.publish(key, payload);
};

export const createSubscriberEvent = <
  T extends keyof typeof PubSubTopic,
  E = unknown
>(
  topic: T | T[]
) => {
  return pubsub.asyncIterator(topic) as unknown as
    | AsyncIterable<E>
    | Promise<AsyncIterable<E>>;
};
