import { sortBy } from 'lodash';

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

interface IInsertAtParam<T> {
  array: T[];
  index: number;
  newItem: T;
  preventDuplicatedItem?: boolean;
}

export const insertAt = <T>({
  array,
  index,
  newItem,
  preventDuplicatedItem = true,
}: IInsertAtParam<T>): T[] => {
  if (preventDuplicatedItem) {
    const removedDuplicatedItem = array.filter((item) => item !== newItem);

    return [
      // part of the array before the specified index
      ...removedDuplicatedItem.slice(0, index),
      // inserted item
      newItem,
      // part of the array after the specified index
      ...removedDuplicatedItem.slice(index),
    ];
  }

  return [
    // part of the array before the specified index
    ...array.slice(0, index),
    // inserted item
    newItem,
    // part of the array after the specified index
    ...array.slice(index),
  ];
};

interface IOrderByFields {
  id: string;
  active: boolean;
}

export const orderByActiveStatusOrSortOrderPosition = <
  T extends IOrderByFields
>(
  data: T[],
  sortOrderIds: string[]
) =>
  sortBy(data, (item) =>
    item.active ? -Infinity : sortOrderIds.findIndex((id) => item.id === id)
  );
