export function mapDataWithIds<T extends { id: string }>(
  data: T[],
  ids: string[]
) {
  const dataMap = new Map(data.map((d) => [d.id, d]));
  return ids.map((id) => dataMap.get(id));
}

interface IMapDataWithIdsByCustomFieldId<T> {
  data: T[];
  ids: string[];
  idField: keyof T;
}

export function mapDataWithIdsByCustomFieldId<T>({
  data,
  idField,
  ids,
}: IMapDataWithIdsByCustomFieldId<T>) {
  const dataMap = new Map(
    data.map((d) => [d[idField] as unknown as string, d])
  );
  return ids.map((id) => dataMap.get(id));
}
