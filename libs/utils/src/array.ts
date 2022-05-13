export const reorder = <T extends { sortOrder: number }>(
  list: T[],
  startIndex: number,
  endIndex: number
) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result.map((item, index) => ({ ...item, sortOrder: index }));
};

/**
 * {@link https://stackoverflow.com/questions/586182/how-to-insert-an-item-into-an-array-at-a-specific-index-javascript}
 */
export const insertAt = <T>(array: T[], index: number, newItem: T): T[] => [
  // part of the array before the specified index
  ...array.slice(0, index),
  // inserted item
  newItem,
  // part of the array after the specified index
  ...array.slice(index),
];
