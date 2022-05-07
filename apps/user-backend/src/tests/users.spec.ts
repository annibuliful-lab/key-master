import { Client, graphqlClient } from '@key-master/test';
import { nanoid } from 'nanoid';

describe('User', () => {
  describe('Mutation', () => {
    let client: Client = null;

    beforeAll(() => {
      client = graphqlClient;
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
  });
});
