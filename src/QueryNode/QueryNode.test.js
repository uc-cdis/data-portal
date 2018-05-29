import QueryNode from './QueryNode';

describe('QueryNode', () => {
  describe('the view-node popup logic', () => {
    it('detects the \'noPopup\' case', () => {
      const result = QueryNode.renderViewPopup({
        popups: {},
        queryNodes: {},
      });

      expect(result.state).toBe('noPopup');
    });

    it('detects the \'viewNode\' case', () => {
      const result = QueryNode.renderViewPopup({
        popups: { view_popup: true },
        queryNodes: { query_node: { submitter_id: '1' } },
      });

      expect(result.state).toBe('viewNode');
    });
  });

  describe('the delete-node popup logic', () => {
    it('detects the \'noPopup\' case', () => {
      const result = QueryNode.renderDeletePopup({
        popups: {},
        queryNodes: {},
      });

      expect(result.state).toBe('noPopup');
    });

    it('detects the \'confirmDelete\' case', () => {
      const result = QueryNode.renderDeletePopup({
        popups: { nodedelete_popup: true },
        queryNodes: { query_node: { submitter_id: '1' } },
      });

      expect(result.state).toBe('confirmDelete');
    });

    it('detects the \'deleteFailed\' case', () => {
      const result = QueryNode.renderDeletePopup({
        popups: { nodedelete_popup: false, view_popup: false },
        queryNodes: { query_node: { submitter_id: '1' }, delete_error: 'some error' },
      });

      expect(result.state).toBe('deleteFailed');
    });

    it('detects the \'waitForDelete\' case', () => {
      const result = QueryNode.renderDeletePopup({
        popups: { nodedelete_popup: 'wait message', view_popup: false },
        queryNodes: { query_node: { submitter_id: '1' } },
      });

      expect(result.state).toBe('waitForDelete');
    });
  });
});
