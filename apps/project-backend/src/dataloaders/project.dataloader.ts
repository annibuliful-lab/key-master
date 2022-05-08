import { prismaClient } from '@key-master/db';
import { mapDataWithIdsByCustomFieldId } from '@key-master/graphql';
import DataLoader from 'dataloader';

export const projectDataLoader = new DataLoader(async (ids: string[]) => {
  const projects = await prismaClient.project.findMany({
    where: { id: { in: [...new Set(ids)] } },
  });

  return mapDataWithIdsByCustomFieldId({
    data: projects,
    idField: 'id',
    ids,
  });
});
