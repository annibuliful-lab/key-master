import { prismaClient } from '@key-master/db';
import { mapDataWithIds } from '@key-master/graphql';

import DataLoader from 'dataloader';

export const projectRoleDataLoader = new DataLoader(
  async (roleIds: string[]) => {
    const projectRoles = await prismaClient.projectRole.findMany({
      where: { id: { in: roleIds } },
    });

    return mapDataWithIds(projectRoles, roleIds);
  }
);
