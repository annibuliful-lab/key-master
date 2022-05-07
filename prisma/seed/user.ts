import { User } from '@prisma/client';
import { prismaClient } from '../client';
import { TEST_USER_A_ID, TEST_USER_B_ID } from '../constants';

export const testUserA: User = {
  id: TEST_USER_A_ID,
  username: 'testUserA',
  password:
    '$argon2i$v=19$m=4096,t=3,p=1$eaVVI3+cTS0H9lVNXnONpg$bH1RXcMeogJfcuxyw5TqyPYsOsox1LDQyQd4FWSPxM0',
  fullname: 'testUserAName',
  createdAt: new Date(1),
  updatedAt: new Date(1),
  deletedAt: null,
  avatar: null,
};

export const testUserB: User = {
  id: TEST_USER_B_ID,
  username: 'testUserB',
  password:
    '$argon2i$v=19$m=4096,t=3,p=1$eaVVI3+cTS0H9lVNXnONpg$bH1RXcMeogJfcuxyw5TqyPYsOsox1LDQyQd4FWSPxM0',
  fullname: 'testUserBName',
  createdAt: new Date(1),
  updatedAt: new Date(1),
  deletedAt: null,
  avatar: null,
};

export const createUser = async () => {
  const result = await prismaClient.$transaction([
    prismaClient.user.upsert({
      where: {
        id: testUserA.id,
      },
      create: testUserA,
      update: {},
    }),
    prismaClient.user.upsert({
      where: {
        id: testUserB.id,
      },
      create: testUserB,
      update: {},
    }),
  ]);

  console.log('Created users', { users: result });
};
