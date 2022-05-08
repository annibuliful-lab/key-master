import { Client, projectOwnerAClient } from '@key-master/test';
import { config } from 'dotenv';
import { nanoid } from 'nanoid';
config();

const PIN_SECRET = process.env.PIN_TEST_KEY;
const MASTER_KEY_SECRET = 'TEST_SECRET';
describe('Key Management', () => {
  let client: Client = null;

  beforeAll(() => {
    client = projectOwnerAClient;
  });

  describe('Mutation', () => {
    it('creates completely', async () => {
      const name = `MOCK_KEY_NAME_${nanoid()}`;

      const created = await client.chain.mutation
        .createKeyManagement({
          input: {
            name,
            pin: PIN_SECRET,
            masterKey: MASTER_KEY_SECRET,
          },
        })
        .get({
          id: true,
          name: true,
        });

      expect(created.id).toBeDefined();
      expect(created.name).toEqual(name);
    });
  });
});
