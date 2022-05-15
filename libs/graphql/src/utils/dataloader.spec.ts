import {
  mapDataWithIds,
  mapDataWithIdsByCustomFieldId,
  mapDatasWithIdsByCustomField,
} from './dataloader';

describe('dataloader', () => {
  describe('mapDataWithIds', () => {
    it('returns map data structure', () => {
      expect(
        mapDataWithIds([{ id: '1' }, { id: '2' }], ['1', '2'])
      ).toMatchSnapshot();
    });
  });

  describe('mapDataWithIdsByCustomFieldId', () => {
    it('returns map data structure with custom field', () => {
      expect(
        mapDataWithIdsByCustomFieldId({
          data: [
            { id: '1', name: 'AAAA' },
            { id: '2', name: 'BBBB' },
            { id: 'a', name: 'CCCC' },
          ],
          ids: ['1', '2'],
          idField: 'id',
        })
      ).toMatchSnapshot();
    });
  });

  describe('mapDatasWithIdsByCustomField', () => {
    it('returns map muliple data structure with custom field', () => {
      expect(
        mapDatasWithIdsByCustomField({
          data: [
            {
              id: '2860e6ff-87ef-44c8-995f-7c4b516c1794',
              projectId: 'TEST_PROJECT_ID_1',
              tag: 'TAG_A',
            },
            {
              id: '6f5b77dd-7859-4229-86d8-1b92063b24e1',
              projectId: 'TEST_PROJECT_ID_2',
              tag: 'TAG_B',
            },
            {
              id: '2860e6ff-87ef-44c8-995f-7c4b516c1890',
              projectId: 'TEST_PROJECT_ID_1',
              tag: 'TAG_C',
            },
          ],
          ids: ['TEST_PROJECT_ID_1', 'TEST_PROJECT_ID_2'],
          idField: 'projectId',
        })
      ).toMatchSnapshot();
    });
  });
});
