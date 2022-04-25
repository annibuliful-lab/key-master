import { Project } from '@prisma/client';
import { prismaClient } from '../client';
import { auditFields } from '../constants';
import { testUser } from './user';

const project: Project = {
  id: 'e28c7bb9-d625-468e-b204-45953fbb95e7',
  ownerId: testUser.id,
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
  console.log('create project', { project: result });
};
