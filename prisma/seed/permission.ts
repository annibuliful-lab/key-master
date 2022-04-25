import { Permission, prisma } from '@prisma/client';
import { prismaClient } from '../client';
import { auditFields } from '../constants';
export const permissions: Permission[] = [
  {
    id: 'afc553ac-654e-4796-b106-1c8c815c0e7a',
    permission: 'USER_WRITE',
    ...auditFields,
  },
  {
    id: '4ad29fb3-1291-4d3d-a17a-24cc60af7142',
    permission: 'USER_READ',
    ...auditFields,
  },
  {
    id: 'cca0ec98-c572-4bdd-b353-08e60f8937cb',
    permission: 'PROJECT_READ',
    ...auditFields,
  },
  {
    id: '98a1749e-171f-4cf7-a060-b4d4912da96e',
    permission: 'PROJECT_WRITE',
    ...auditFields,
  },
];

export const createPermissions = async () => {
  const listCreatePermissions = permissions.map((data) =>
    prismaClient.permission.upsert({
      where: {
        id: data.id,
      },
      update: {},
      create: data,
    })
  );
  const result = await prismaClient.$transaction(listCreatePermissions);
  console.log('Created permissions', { permissions: result });
};
