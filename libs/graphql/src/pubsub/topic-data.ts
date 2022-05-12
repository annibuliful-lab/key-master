import { PubSubTopic } from './topics';

export type TopicDataStructure = {
  [PubSubTopic.CREATED_USER]: {
    createdUser: {
      id: string;
      fullname: string;
    };
  };
  [PubSubTopic.LOGED_USER]: {
    logedUser: {
      id: string;
      fullname: string;
      token: string;
      refreshToken: string;
    };
  };
};
