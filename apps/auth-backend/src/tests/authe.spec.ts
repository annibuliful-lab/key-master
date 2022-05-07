import { Client, graphqlClient } from '@key-master/test';

describe('Auth', () => {
  let client: Client = null;

  beforeAll(() => {
    client = graphqlClient;
  });

  it('login correctly', async () => {
    const token = await client.chain.mutation
      .login({
        input: {
          username: 'testUserA',
          password: '1234',
        },
      })
      .token.get();

    expect(token).toBeDefined();
  });

  it('throws error witn wrong username', async () => {
    expect(
      client.chain.mutation
        .login({
          input: {
            username: `MOCK_WRONG_PASSWORD`,
            password: '1234',
          },
        })
        .token.get()
    ).rejects.toBeTruthy();
  });

  it('throws error with wrong password', async () => {
    expect(
      client.chain.mutation
        .login({
          input: {
            username: `testUserA`,
            password: '12345',
          },
        })
        .token.get()
    ).rejects.toBeTruthy();
  });
});
