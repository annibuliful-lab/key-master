import {
  Client,
  expectAuthenticationError,
  expectDuplicatedError,
  graphqlClient,
  projectOwnerAClient,
} from '@key-master/test';
import { nanoid } from 'nanoid';

describe('User', () => {
  describe('Mutation', () => {
    let client: Client = null;
    let authorizedClient: Client = null;
    beforeAll(() => {
      client = graphqlClient;
      authorizedClient = projectOwnerAClient;
    });

    it('creates a new user', async () => {
      const input = {
        username: `MOCK_USERNAME_${nanoid()}`,
        password: 'MOCK_PASSWORD',
        fullname: `MOCK_FULLNAME_${nanoid()}`,
      };

      const newUser = await client.chain.mutation
        .createUser({
          input,
        })
        .get({ fullname: true, id: true });

      expect(newUser.fullname).toEqual(input.fullname);
      expect(newUser.id).toBeDefined();
    });

    it('throws error when create with duplicated username ', async () => {
      const input = {
        username: `MOCK_USERNAME_${nanoid()}`,
        password: 'MOCK_PASSWORD',
        fullname: `MOCK_FULLNAME_${nanoid()}`,
      };

      await client.chain.mutation
        .createUser({
          input,
        })
        .get({ fullname: true, id: true });

      expectDuplicatedError(
        client.chain.mutation
          .createUser({
            input,
          })
          .get({ fullname: true, id: true })
      );
    });

    it('gets by authorized user', async () => {
      const result = await authorizedClient.chain.query.me.get({
        id: true,
        fullname: true,
      });
      expect(result.id).toEqual('TEST_USER_A_ID');
      expect(result.fullname).toBeDefined();
    });

    it('throws error when get without authorization', () => {
      expectAuthenticationError(client.chain.query.me.id.get());
    });
  });
});
