import { nanoid } from 'nanoid';
import { graphqlClient } from '../graphql-client';

interface ICreateUser {
  customUsername?: string;
}
export function createUser({ customUsername }: ICreateUser) {
  const username = customUsername
    ? customUsername
    : `MOCK_USER_NAME_${nanoid()}`;
  return graphqlClient.chain.mutation
    .createUser({
      input: {
        username,
        password: '1234',
        fullname: `MOCK_FULL_NAME_${nanoid()}`,
      },
    })
    .get({
      id: true,
      fullname: true,
    });
}
