import { ProjectRoleUser } from '@prisma/client';
import { prismaClient } from '../../client';
import {
  PROJECT_ID,
  PROJECT_ROLE_ADMIN_ID,
  PROJECT_ROLE_USER_ID,
  TEST_USER_A_ID,
  TEST_USER_B_ID,
} from '../../constants';

export const projectAdminUser: ProjectRoleUser = {
  id: `${PROJECT_ID}-ROLE-ADMIN-USER-ID`,
  projectId: PROJECT_ID,
  userId: TEST_USER_A_ID,
  roleId: PROJECT_ROLE_ADMIN_ID,
  updatedBy: TEST_USER_A_ID,
  createdBy: TEST_USER_A_ID,
  active: true,
  updatedAt: new Date(1),
  createdAt: new Date(1),
  deletedAt: null,
};

export const projectUser: ProjectRoleUser = {
  id: `${PROJECT_ID}-ROLE-USER-USER-ID`,
  projectId: PROJECT_ID,
  roleId: PROJECT_ROLE_USER_ID,
  userId: TEST_USER_B_ID,
  updatedBy: TEST_USER_B_ID,
  createdBy: TEST_USER_B_ID,
  active: true,
  updatedAt: new Date(1),
  createdAt: new Date(1),
  deletedAt: null,
};

export const createProjectRoleUser = async () => {
  const adminUser = prismaClient.projectRoleUser.upsert({
    where: {
      roleId_userId_projectId: {
        projectId: projectAdminUser.projectId,
        roleId: projectAdminUser.roleId,
        userId: projectAdminUser.userId,
      },
    },
    update: {},
    create: projectAdminUser,
  });

  const user = prismaClient.projectRoleUser.upsert({
    where: {
      roleId_userId_projectId: {
        projectId: projectUser.projectId,
        roleId: projectUser.roleId,
        userId: projectUser.userId,
      },
    },
    update: {},
    create: projectUser,
  });

  const result = await prismaClient.$transaction([adminUser, user]);

  console.log('Created Project Role User', { projectRoleUser: result });
};
