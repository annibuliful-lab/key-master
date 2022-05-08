import { prismaClient } from '@key-master/db';
import { mapDataWithIdsByCustomFieldId } from '@key-master/graphql';
import DataLoader from 'dataloader';

export const projectRoleDataLoader = new DataLoader(
  async (roleIds: string[]) => {
    const projectRoles = await prismaClient.projectRole.findMany({
      where: { id: { in: [...new Set(roleIds)] } },
    });

    return mapDataWithIdsByCustomFieldId({
      data: projectRoles,
      idField: 'id',
      ids: roleIds,
    });
  }
);
