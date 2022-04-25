import { Role } from '@prisma/client';
import { prismaClient } from '../client';
import { auditFields } from '../constants';
import { permissions } from './permission';
import { project } from './project';
import { testUser } from './user';

export const roleAdmin: Role = {
  id: 'd8d5895e-e3a0-4329-bf2a-db7ed32a31cd',
  projectId: project.id,
  role: 'ADMIN',
  ...auditFields,
};

export const createProjectRoleAndPermissions = async () => {
  const createRole = prismaClient.role.upsert({
    where: {
      id: roleAdmin.id,
    },
    create: {
      ...roleAdmin,
    },
    update: {},
  });

  const listRolePermissions = permissions.map((permission) =>
    prismaClient.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: roleAdmin.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        ...auditFields,
        roleId: roleAdmin.id,
        permissionId: permission.id,
        createdBy: testUser.id,
        updatedBy: testUser.id,
      },
    })
  );

  const result = await prismaClient.$transaction([
    createRole,
    ...listRolePermissions,
  ]);
  console.log('createProjectRole', { permissions: result });
};
