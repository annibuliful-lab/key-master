import { reorder, insertAt } from '../array';

const MOCK_LIST = [
  {
    id: 'MOCK_ONE',
    sortOrder: 0,
  },
  {
    id: 'MOCK_TWO',
    sortOrder: 1,
  },
  {
    id: 'MOCK_THREE',
    sortOrder: 2,
  },
];

describe('reorder funciton ', () => {
  it('it should update sort order when given index', () => {
    const itemOneIndex = 0;

    const newList = reorder(MOCK_LIST, itemOneIndex, 1);

    const itemOneData = newList[0];

    expect(itemOneData.id).toEqual(MOCK_LIST[1].id);
    expect(itemOneData.sortOrder).toEqual(0);
  });
  it('first item should be last when given last index = 2', () => {
    const itemOneIndex = 0;

    const newList = reorder(MOCK_LIST, itemOneIndex, 2);

    const selectedItem = newList.find((item) => item.id === MOCK_LIST[0].id);

    expect(selectedItem?.sortOrder).toEqual(2);
  });
});

describe('insertAt function', () => {
  it('it should add number to specified index', () => {
    const MOCK_ARRAY = [1, 2, 3, 4, 5];
    expect(insertAt(MOCK_ARRAY, 3, 6)).toEqual([1, 2, 3, 6, 4, 5]);
  });

  it('it should add object to specified index', () => {
    const MOCK_ARRAY_OBJECT = [
      {
        id: 1,
        name: 'MOCK_NAME_1',
      },
      {
        id: 2,
        name: 'MOCK_NAME_2',
      },
      {
        id: 3,
        name: 'MOCK_NAME_3',
      },
      {
        id: 4,
        name: 'MOCK_NAME_4',
      },
    ];

    const MOCK_DATA = {
      id: 4,
      name: 'MOCK_NAME_4',
    };

    expect(
      insertAt(MOCK_ARRAY_OBJECT, 2, {
        id: 4,
        name: 'MOCK_NAME_4',
      })[2]
    ).toEqual(MOCK_DATA);
  });
});
