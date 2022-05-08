import { nanoid } from 'nanoid';
import { graphqlClient } from '../graphql-client';

interface ICreateUser {
  customUsername?: string;
  customFullname?: string;
}
export function createUser({ customUsername, customFullname }: ICreateUser) {
  const username = customUsername
    ? customUsername
    : `MOCK_USER_NAME_${nanoid()}`;

  const fullname = customFullname
    ? customFullname
    : `MOCK_FULL_NAME_${nanoid()}`;

  return graphqlClient.chain.mutation
    .createUser({
      input: {
        username,
        password: '1234',
        fullname,
      },
    })
    .get({
      id: true,
      fullname: true,
    });
}
