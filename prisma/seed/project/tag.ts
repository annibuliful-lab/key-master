import { prisma, ProjectTag } from '@prisma/client';
import { prismaClient } from '../../client';
import { PROJECT_ID, TEST_USER_A_ID } from '../../constants';
type CreateTagType = Omit<ProjectTag, 'createdAt' | 'updatedAt' | 'deletedAt'>;

export const tagA: CreateTagType = {
  id: '2860e6ff-87ef-44c8-995f-7c4b516c1794',
  tag: 'TAG_A',
  projectId: PROJECT_ID,
  createdBy: TEST_USER_A_ID,
  updatedBy: TEST_USER_A_ID,
};

export const tagB: CreateTagType = {
  id: '6f5b77dd-7859-4229-86d8-1b92063b24e1',
  tag: 'TAG_B',
  projectId: PROJECT_ID,
  createdBy: TEST_USER_A_ID,
  updatedBy: TEST_USER_A_ID,
};

export async function createProjectTag() {
  const upsertTagA = prismaClient.projectTag.upsert({
    where: {
      id: tagA.id,
    },
    update: {},
    create: tagA,
  });

  const upsertTagB = prismaClient.projectTag.upsert({
    where: {
      id: tagB.id,
    },
    update: {},
    create: tagB,
  });

  const result = await prismaClient.$transaction([upsertTagA, upsertTagB]);
  console.log('create project-tag', { result });
}
