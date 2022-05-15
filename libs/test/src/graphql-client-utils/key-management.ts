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
export async function createKeyManagement({
  client,
  customName,
  customMasterKey,
}: ICreateKeyManagementParam) {
  const name = customName ?? `MOCK_NAME_${nanoid()}`;

  const createdKey = await client.chain.mutation
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

  await client.chain.mutation
    .createUserActivity({
      input: {
        serviceName: 'KeyManagement',
        parentPkId: createdKey.id,
        userId: 'TEST_USER_A_ID',
        data: {
          name: createdKey.name,
        },
        type: 'CREATE',
      },
    })
    .get({
      id: true,
      parentPkId: true,
      serviceName: true,
    });

  return createdKey;
}
