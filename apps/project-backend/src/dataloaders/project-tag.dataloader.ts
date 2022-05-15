import { prismaClient } from '@key-master/db';
import { mapDatasWithIdsByCustomField } from '@key-master/graphql';
import DataLoader from 'dataloader';

export const projectTagDataLoader = new DataLoader(async (ids: string[]) => {
  const projectTags = await prismaClient.projectTag.findMany({
    where: { projectId: { in: [...new Set(ids)] } },
  });

  return mapDatasWithIdsByCustomField({
    data: projectTags,
    idField: 'projectId',
    ids,
  });
});
