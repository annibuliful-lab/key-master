import { User } from '@prisma/client';
import { prismaClient } from '../client';

export const testUser: User = {
  id: 'dbb3b0f8-8c0a-4914-b773-ab5cee865c64',
  username: 'test',
  password:
    '$argon2i$v=19$m=4096,t=3,p=1$eaVVI3+cTS0H9lVNXnONpg$bH1RXcMeogJfcuxyw5TqyPYsOsox1LDQyQd4FWSPxM0',
  fullname: '1111',
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

export const createUser = async () => {
  const result = await prismaClient.user.upsert({
    where: {
      id: testUser.id,
    },
    create: testUser,
    update: {},
  });
  console.log('create user', { user: result });
};
