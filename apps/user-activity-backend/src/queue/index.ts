import {
  userKeyManagementSubscriberEvent,
  userLoginSubscriberEvent,
} from './user';

export const initSubscriberEvents = () => {
  const closeUserLoginEvent = userLoginSubscriberEvent();
  const closeUserKeyManagementEvent = userKeyManagementSubscriberEvent();

  return async () => {
    await closeUserLoginEvent.close();
    await closeUserKeyManagementEvent.close();
  };
};
