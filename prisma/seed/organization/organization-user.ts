import { OrganizationUser } from '@prisma/client';
import { prismaClient } from '../../client';
import {
  ORGANIZATION_A_USER_A_ID,
  ORGANIZATION_A_USER_B_ID,
  PROJECT_ORGANIZATION_A_ID,
  TEST_USER_A_ID,
  TEST_USER_B_ID,
} from '../../constants';

type OrganizationUserType = Pick<
  OrganizationUser,
  'id' | 'userId' | 'active' | 'organizationId' | 'createdBy' | 'updatedBy'
>;

export const organizationUserA: OrganizationUserType = {
  id: ORGANIZATION_A_USER_A_ID,
  organizationId: PROJECT_ORGANIZATION_A_ID,
  userId: TEST_USER_A_ID,
  active: true,
  createdBy: TEST_USER_A_ID,
  updatedBy: TEST_USER_A_ID,
};

export const organizationUserB: OrganizationUserType = {
  id: ORGANIZATION_A_USER_B_ID,
  organizationId: PROJECT_ORGANIZATION_A_ID,
  userId: TEST_USER_B_ID,
  active: true,
  createdBy: TEST_USER_B_ID,
  updatedBy: TEST_USER_B_ID,
};

export const createOrganizationUser = async () => {
  const createOrganizationUserA = prismaClient.organizationUser.upsert({
    where: {
      id: organizationUserA.id,
    },
    update: {},
    create: organizationUserA,
  });

  const createOrganizationUserB = prismaClient.organizationUser.upsert({
    where: {
      id: organizationUserB.id,
    },
    update: {},
    create: organizationUserB,
  });

  const result = await prismaClient.$transaction([
    createOrganizationUserA,
    createOrganizationUserB,
  ]);

  console.log('Created organization users', { organizationUser: result });
};
