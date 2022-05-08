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

    it('throws error when update deleted id', async () => {
      const createdKey = await createKeyManagement({ client });

      await client.chain.mutation
        .deleteKeyMangement({
          id: createdKey.id,
          pin: PIN_SECRET,
        })
        .success.get();

      expect(
        client.chain.mutation
          .updateKeyManagement({
            id: createdKey.id,
            input: {
              pin: PIN_SECRET,
              name: 'NEW_NAME',
            },
          })
          .get({
            id: true,
            name: true,
          })
      ).rejects.toBeTruthy();
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

    it('updates key pin', async () => {
      const createdKey = await createKeyManagement({ client });
      const updated = await client.chain.mutation
        .updateKeyManagementPin({
          id: createdKey.id,
          input: {
            oldPin: PIN_SECRET,
            newPin: 'NEW_PIN',
          },
        })
        .get({
          id: true,
          name: true,
        });
      expect(updated.id).toEqual(createdKey.id);
      expect(updated.name).toEqual(createdKey.name);
    });

    it('throws error when update key pin with deleted id', async () => {
      const createdKey = await createKeyManagement({ client });

      await client.chain.mutation
        .deleteKeyMangement({
          id: createdKey.id,
          pin: PIN_SECRET,
        })
        .success.get();

      expect(
        client.chain.mutation
          .updateKeyManagementPin({
            id: createdKey.id,
            input: {
              oldPin: `WRONG_PIN`,
              newPin: 'NEW_PIN',
            },
          })
          .get({
            id: true,
            name: true,
          })
      ).rejects.toBeTruthy();
    });
    it('throws error when update key pin with wrong old pin', async () => {
      const createdKey = await createKeyManagement({ client });
      expect(
        client.chain.mutation
          .updateKeyManagementPin({
            id: createdKey.id,
            input: {
              oldPin: `WRONG_PIN`,
              newPin: 'NEW_PIN',
            },
          })
          .get({
            id: true,
            name: true,
          })
      ).rejects.toBeTruthy();
    });

    it('deletes key', async () => {
      const createdKey = await createKeyManagement({ client });

      expect(
        client.chain.mutation
          .deleteKeyMangement({ id: createdKey.id, pin: PIN_SECRET })
          .success.get()
      ).resolves.toBeTruthy();
    });

    it('throws error when delete with wrong id', async () => {
      expect(
        client.chain.mutation
          .deleteKeyMangement({
            id: `WRONG_KEY_ID_${nanoid()}`,
            pin: PIN_SECRET,
          })
          .success.get()
      ).rejects.toBeTruthy();
    });

    it('throws error when delete with correct id but wrong pin', async () => {
      const createdKey = await createKeyManagement({ client });
      expect(
        client.chain.mutation
          .deleteKeyMangement({ id: createdKey.id, pin: `WRONG_PIN_SECRET` })
          .success.get()
      ).rejects.toBeTruthy();
    });

    it('returns master key', async () => {
      const masterKey = `MASTER_KEY_${nanoid()}`;
      const createdKey = await createKeyManagement({
        client,
        customMasterKey: masterKey,
      });

      const result = await client.chain.query
        .getKeyManagementById({
          id: createdKey.id,
        })
        .masterKey({ pin: PIN_SECRET })
        .get();
      expect(result).toEqual(masterKey);
    });

    it('throws error when get master key with wrong pin', async () => {
      const masterKey = `MASTER_KEY_${nanoid()}`;
      const createdKey = await createKeyManagement({
        client,
        customMasterKey: masterKey,
      });

      expect(
        client.chain.query
          .getKeyManagementById({
            id: createdKey.id,
          })
          .masterKey({ pin: `WRONG_PIN_SECRET_${nanoid()}` })
          .get()
      ).rejects.toBeTruthy();
    });

    it('gets by ids', async () => {
      const masterKey = `MASTER_KEY_${nanoid()}`;
      const ids = (
        await Promise.all([
          createKeyManagement({
            client,
            customMasterKey: masterKey,
          }),
          createKeyManagement({
            client,
            customMasterKey: masterKey,
          }),
          createKeyManagement({
            client,
            customMasterKey: masterKey,
          }),
        ])
      ).map((id) => id.id);

      expect(
        (
          await client.chain.query
            .getKeyManagementByIds({
              ids,
            })
            .get({ id: true })
        ).every(({ id }) => ids.includes(id))
      ).toBeTruthy();
    });
  });
});
