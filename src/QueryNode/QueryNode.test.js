import {QueryNode} from './QueryNode.jsx';

describe( "QueryNode", function() {
  describe( "the popup logic", function() {
    const testNode = new QueryNode( {} );

    it( "detects the 'noPopup' case", function() {
      const result = testNode.renderPopup( {
        popups: {},
        query_nodes: {}
      });

      expect( result.state ).toBe( 'noPopup' );
    });

    it( "detects the 'confirmDelete' case", function() {
      const result = testNode.renderPopup( {
        popups: { nodedelete_popup: true },
        query_nodes: { }
      });

      expect( result.state ).toBe( 'confirmDelete' );
    });

    it( "detects the 'deleteFailed' case", function() {
      const result = testNode.renderPopup( {
        popups: { nodedelete_popup: false, view_popup: true },
        query_nodes: { query_node: true, delete_error: "some error" }
      });

      expect( result.state ).toBe( 'deleteFailed' );
    });

    it( "detects the 'waitForDelete' case", function() {
      const result = testNode.renderPopup( {
        popups: { nodedelete_popup: false, view_popup: "wait message" },
        query_nodes: { query_node: true }
      });

      expect( result.state ).toBe( 'waitForDelete' );
    });
  });
});
