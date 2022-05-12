import { userLoginSubscriberEvent } from './user-login';

export const initSubscriberEvents = () => {
  const closeUserLoginEvent = userLoginSubscriberEvent();

  return async () => {
    await closeUserLoginEvent.close();
  };
};
