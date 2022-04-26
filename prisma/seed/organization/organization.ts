import { ProjectOrganization } from '@prisma/client';
import { prismaClient } from '../../client';
import {
  PROJECT_ID,
  PROJECT_ORGANIZATION_A_ID,
  PROJECT_ORGANIZATION_B_ID,
} from '../../constants';

type Organization = Pick<
  ProjectOrganization,
  'active' | 'id' | 'name' | 'projectId'
>;

export const organizationA: Organization = {
  id: PROJECT_ORGANIZATION_A_ID,
  projectId: PROJECT_ID,
  name: 'OrganizationA',
  active: true,
};

export const organizationB: Organization = {
  id: PROJECT_ORGANIZATION_B_ID,
  projectId: PROJECT_ID,
  name: 'OrganizationB',
  active: true,
};

export const createProjectOrganization = async () => {
  const result = await prismaClient.$transaction(
    [organizationA, organizationB].map((data) =>
      prismaClient.projectOrganization.upsert({
        where: {
          projectId_name: {
            projectId: data.projectId,
            name: data.name,
          },
        },
        update: {},
        create: data,
      })
    )
  );

  console.log('Created organization', { result });
};
