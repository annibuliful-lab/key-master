import { prismaClient } from '@key-master/db';
import { mapDataWithIdsByCustomFieldId } from '@key-master/graphql';
import DataLoader from 'dataloader';

export const projectOrganizationDataLoader = new DataLoader(
  async (roleIds: string[]) => {
    const projectOrganizations =
      await prismaClient.projectOrganization.findMany({
        where: { id: { in: [...new Set(roleIds)] } },
      });

    return mapDataWithIdsByCustomFieldId({
      data: projectOrganizations,
      idField: 'id',
      ids: roleIds,
    });
  }
);
