import {
  Client,
  projectOwnerAClient,
  createKeyManagement,
} from '@key-master/test';
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

    it('throws error when create duplicated name', async () => {
      const dupKey = `MOCK_DUPLICATE_${nanoid()}`;
      await createKeyManagement({ client, customName: dupKey });
      expect(
        client.chain.mutation
          .createKeyManagement({
            input: {
              name: dupKey,
              pin: PIN_SECRET,
              masterKey: MASTER_KEY_SECRET,
            },
          })
          .get({
            id: true,
            name: true,
          })
      ).rejects.toBeTruthy();
    });

    it('updates name with correct id', async () => {
      const createdKey = await createKeyManagement({ client });
      const newName = `MOCK_NEW_NAME_${nanoid()}`;

      const updated = await client.chain.mutation
        .updateKeyManagement({
          id: createdKey.id,
          input: {
            pin: PIN_SECRET,
            name: newName,
          },
        })
        .get({
          id: true,
          name: true,
        });

      expect(updated.id).toEqual(createdKey.id);
      expect(updated.name).toEqual(newName);
    });

    it('throws error when update with correct id but wrong pin', async () => {
      const createdKey = await createKeyManagement({ client });
      expect(
        client.chain.mutation
          .updateKeyManagement({
            id: createdKey.id,
            input: {
              pin: 'WRONG_PIN_SECRT',
              name: 'NEW_NAME',
            },
          })
          .get({
            id: true,
            name: true,
          })
      ).rejects.toBeTruthy();
    });
  });
});
