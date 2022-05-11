import { PubSub } from 'graphql-subscriptions';

let _pubsub: PubSub = null;
function getClient() {
  if (_pubsub) {
    return _pubsub;
  }

  _pubsub = new PubSub();
  return _pubsub;
}

export const pubsub = getClient();

export enum PubSubTopic {
  CREATED_USER = 'CREATED_USER',
}
