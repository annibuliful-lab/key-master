import { Project } from '@prisma/client';
import { prismaClient } from '../../client';
import { auditFields, PROJECT_ID } from '../../constants';
import { testUserA } from '../user';

export const project: Project = {
  id: PROJECT_ID,
  ownerId: testUserA.id,
  name: 'test-project',
  ...auditFields,
};

export const createProject = async () => {
  const result = await prismaClient.project.upsert({
    where: {
      id: project.id,
    },
    create: project,
    update: {},
  });
  console.log('Created project', { project: result });
};
