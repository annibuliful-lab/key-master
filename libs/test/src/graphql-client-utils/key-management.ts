import { Client } from '@key-master/test';
import { config } from 'dotenv';
import { nanoid } from 'nanoid';
config();

const PIN_SECRET = process.env.PIN_TEST_KEY;
const MASTER_KEY_SECRET = process.env.MASTER_KEY_SECRET;

interface ICreateKeyManagementParam {
  client: Client;
  customName?: string;
  customMasterKey?: string;
}
export function createKeyManagement({
  client,
  customName,
  customMasterKey,
}: ICreateKeyManagementParam) {
  const name = customName ?? `MOCK_NAME_${nanoid()}`;

  return client.chain.mutation
    .createKeyManagement({
      input: {
        name,
        pin: PIN_SECRET,
        masterKey: customMasterKey ?? MASTER_KEY_SECRET,
      },
    })
    .get({
      id: true,
      name: true,
    });
}
