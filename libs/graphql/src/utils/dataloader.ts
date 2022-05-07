export function mapDataWithIds<T extends { id: string }>(
  data: T[],
  ids: string[]
) {
  const dataMap = new Map(data.map((shop) => [shop.id, shop]));
  return ids.map((id) => dataMap.get(id));
}
