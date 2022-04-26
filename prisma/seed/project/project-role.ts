import { prisma, Role } from '@prisma/client';
import { prismaClient } from '../../client';

import {
  auditFields,
  PROJECT_ID,
  PROJECT_ROLE_ADMIN_ID,
  PROJECT_ROLE_USER_ID,
} from '../../constants';
import { permissions } from '../permission';
import { testUserA } from '../user';

export const roleAdmin: Role = {
  id: PROJECT_ROLE_ADMIN_ID,
  projectId: PROJECT_ID,
  role: 'ADMIN',
  ...auditFields,
};

export const roleUser: Role = {
  id: PROJECT_ROLE_USER_ID,
  projectId: PROJECT_ID,
  role: 'USER',
  ...auditFields,
};

export const createProjectRoleAndPermissions = async () => {
  const createAdminRole = prismaClient.role.upsert({
    where: {
      id: roleAdmin.id,
    },
    create: roleAdmin,
    update: {},
  });

  const createUserRole = prismaClient.role.upsert({
    where: {
      id: roleUser.id,
    },
    create: roleUser,
    update: {},
  });

  const listRoleAdminPermissions = permissions.map((permission) =>
    prismaClient.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: roleAdmin.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: roleAdmin.id,
        permissionId: permission.id,
        createdBy: testUserA.id,
        updatedBy: testUserA.id,
      },
    })
  );

  const listRoleUserPermissions = permissions.map((permission) =>
    prismaClient.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: roleUser.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: roleUser.id,
        permissionId: permission.id,
        createdBy: testUserA.id,
        updatedBy: testUserA.id,
      },
    })
  );

  const result = await prismaClient.$transaction([
    createAdminRole,
    createUserRole,
    ...listRoleAdminPermissions,
    ...listRoleUserPermissions,
  ]);

  console.log('Created Project Role', { projectRole: result });
};
