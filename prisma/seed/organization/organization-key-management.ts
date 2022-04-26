import { OrganizationKeyManagement } from '@prisma/client';
import { prismaClient } from '../../client';
import {
  KEY_MANAGEMENT_A_ID,
  KEY_MANAGEMENT_B_ID,
  ORGANIZATION_KEY_MANAGEMENT_A_ID,
  ORGANIZATION_KEY_MANAGEMENT_B_ID,
  PROJECT_ORGANIZATION_A_ID,
} from '../../constants';
import { testUserA } from '../user';

type OrganizationKeyManagementType = Omit<
  OrganizationKeyManagement,
  'createdAt' | 'updatedAt' | 'deletedAt'
>;

export const organizationKeyManagementA: OrganizationKeyManagementType = {
  id: ORGANIZATION_KEY_MANAGEMENT_A_ID,
  keyManagementId: KEY_MANAGEMENT_A_ID,
  projectOrganizationId: PROJECT_ORGANIZATION_A_ID,
  createdBy: testUserA.id,
  updatedBy: testUserA.id,
};

export const organizationKeyManagementB: OrganizationKeyManagementType = {
  id: ORGANIZATION_KEY_MANAGEMENT_B_ID,
  keyManagementId: KEY_MANAGEMENT_B_ID,
  projectOrganizationId: PROJECT_ORGANIZATION_A_ID,
  createdBy: testUserA.id,
  updatedBy: testUserA.id,
};

export const createOrganizationKeyManagement = async () => {
  const createA = prismaClient.organizationKeyManagement.upsert({
    where: {
      id: organizationKeyManagementA.id,
    },
    update: {},
    create: organizationKeyManagementA,
  });

  const createB = prismaClient.organizationKeyManagement.upsert({
    where: {
      id: organizationKeyManagementB.id,
    },
    update: {},
    create: organizationKeyManagementB,
  });

  const result = await prismaClient.$transaction([createA, createB]);

  console.log('Created Organization Key Management', { result });
};
