import QueryNode from './QueryNode';

describe('QueryNode', () => {
  describe('the view-node popup logic', () => {
    const testNode = new QueryNode({});

    it('detects the \'noPopup\' case', () => {
      const result = testNode.renderViewPopup({
        popups: {},
        query_nodes: {},
      });

      expect(result.state).toBe('noPopup');
    });

    it('detects the \'viewNode\' case', () => {
      const result = testNode.renderViewPopup({
        popups: { view_popup: true },
        query_nodes: { query_node: true },
      });

      expect(result.state).toBe('viewNode');
    });
  });

  describe('the delete-node popup logic', () => {
    const testNode = new QueryNode({});

    it('detects the \'noPopup\' case', () => {
      const result = testNode.renderDeletePopup({
        popups: {},
        query_nodes: {},
      });

      expect(result.state).toBe('noPopup');
    });

    it('detects the \'confirmDelete\' case', () => {
      const result = testNode.renderDeletePopup({
        popups: { nodedelete_popup: true },
        query_nodes: { },
      });

      expect(result.state).toBe('confirmDelete');
    });

    it('detects the \'deleteFailed\' case', () => {
      const result = testNode.renderDeletePopup({
        popups: { nodedelete_popup: false, view_popup: false },
        query_nodes: { query_node: true, delete_error: 'some error' },
      });

      expect(result.state).toBe('deleteFailed');
    });

    it('detects the \'waitForDelete\' case', () => {
      const result = testNode.renderDeletePopup({
        popups: { nodedelete_popup: 'wait message', view_popup: false },
        query_nodes: { query_node: true },
      });

      expect(result.state).toBe('waitForDelete');
    });
  });
});
