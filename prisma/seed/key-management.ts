import { KeyManagment } from '@prisma/client';
import { prismaClient } from '../client';
import {
  KEY_MANAGEMENT_A_ID,
  KEY_MANAGEMENT_B_ID,
  PROJECT_ID,
} from '../constants';
import { testUserA } from './user';

type KeyManagementType = Omit<
  KeyManagment,
  'createdAt' | 'updatedAt' | 'deletedAt'
>;

const keyManagementA: KeyManagementType = {
  id: KEY_MANAGEMENT_A_ID,
  projectId: PROJECT_ID,
  name: 'KEY_MANAGEMENT_A',
  pin: 'MOCK_PIN_A',
  masterKey: 'MASTER_KEY_A',
  masterKeyIv: 'MOCK_IV_CIPHER_A',
  secretHash: 'MOCK_SECRET_A',
  createdBy: testUserA.id,
  updatedBy: testUserA.id,
};

const keyManagementB: KeyManagementType = {
  id: KEY_MANAGEMENT_B_ID,
  projectId: PROJECT_ID,
  name: 'KEY_MANAGEMENT_B',
  pin: 'MOCK_PIN_B',
  masterKey: 'MASTER_KEY_B',
  masterKeyIv: 'MOCK_IV_CIPHER_B',
  secretHash: 'MOCK_SECRET_B',
  createdBy: testUserA.id,
  updatedBy: testUserA.id,
};

export const createKeyManagement = async () => {
  const createKeyManagementA = prismaClient.keyManagment.upsert({
    where: {
      id: keyManagementA.id,
    },
    create: keyManagementA,
    update: {},
  });

  const createKeyManagementB = prismaClient.keyManagment.upsert({
    where: {
      id: keyManagementB.id,
    },
    create: keyManagementB,
    update: {},
  });

  const result = await prismaClient.$transaction([
    createKeyManagementA,
    createKeyManagementB,
  ]);

  console.log('Created Key Management', { result });
};
