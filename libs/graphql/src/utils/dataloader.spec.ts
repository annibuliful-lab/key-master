import { mapDataWithIds, mapDataWithIdsByCustomFieldId } from './dataloader';

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
});
