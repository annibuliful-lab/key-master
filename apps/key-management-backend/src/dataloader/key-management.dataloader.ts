import { prismaClient } from '@key-master/db';
import { mapDataWithIdsByCustomFieldId } from '@key-master/graphql';
import DataLoader from 'dataloader';

export const keyManagementDataLoader = new DataLoader(async (ids: string[]) => {
  const keyManagements = await prismaClient.keyManagment.findMany({
    where: { id: { in: [...new Set(ids)] } },
  });

  return mapDataWithIdsByCustomFieldId({
    data: keyManagements,
    idField: 'id',
    ids,
  });
});
