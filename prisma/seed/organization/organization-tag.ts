import { OrganizationTag } from '@prisma/client';
import { prismaClient } from '../../client';
import {
  PROJECT_ID,
  PROJECT_ORGANIZATION_A_ID,
  TEST_USER_A_ID,
} from '../../constants';
import { tagA, tagB } from '../project/tag';

type CreateOrganizationTagType = Omit<
  OrganizationTag,
  'createdAt' | 'updatedAt' | 'deletedAt'
>;

export const organizationAwithTagA: CreateOrganizationTagType = {
  id: '7faf780f-c0a9-43da-a3bc-8f0f1e474667',
  tagId: tagA.id,
  projectId: PROJECT_ID,
  projectOrganizationId: PROJECT_ORGANIZATION_A_ID,
  createdBy: TEST_USER_A_ID,
  updatedBy: TEST_USER_A_ID,
};

export const organizationAwithTagB: CreateOrganizationTagType = {
  id: '6b67286a-a7a5-4e2a-ba1c-b4a79acc1486',
  tagId: tagB.id,
  projectId: PROJECT_ID,
  projectOrganizationId: PROJECT_ORGANIZATION_A_ID,
  createdBy: TEST_USER_A_ID,
  updatedBy: TEST_USER_A_ID,
};

export async function createOrganizationTag() {
  const upsertOrgAWithTagA = prismaClient.organizationTag.upsert({
    where: {
      id: organizationAwithTagA.id,
    },
    update: {},
    create: organizationAwithTagA,
  });

  const upsertOrgWithTagB = prismaClient.organizationTag.upsert({
    where: {
      id: organizationAwithTagB.id,
    },
    update: {},
    create: organizationAwithTagB,
  });

  const result = await prismaClient.$transaction([
    upsertOrgAWithTagA,
    upsertOrgWithTagB,
  ]);

  console.log('create organization tag', { result });
}
