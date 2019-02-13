import {
  assignNodePositions,
  createNodesAndEdges,
  findRoot,
  nodesBreadthFirst,
  getTreeHierarchy,
} from './utils';
import { buildTestData } from './testData';


describe('the DataModelGraph utils helper', () => {
  it('can find the root of a graph', () => {
    const { nodes, edges } = buildTestData();
    expect(findRoot(nodes, edges)).toBe('project');
  });

  it('extracts nodes and edges from a dictionary', () => {
    const testData = buildTestData();
    const { nodes, edges } = createNodesAndEdges({ dictionary: testData.dictionary }, true);
    expect(nodes.length).toBe(testData.nodes.length);
    expect(edges.length).toBe(testData.edges.length);
  });

  it('can ignore a node type in the dictionary', () => {
    const testData = buildTestData();
    const { nodes, edges } = createNodesAndEdges({ dictionary: testData.dictionary }, true, ['project']);
    expect(nodes.length).toBe(testData.nodes.length - 1);
    expect(edges.length).toBe(testData.edges.length - 2);
  });

  it('can determines the hierarchy of a tree', () => {
    const { nodes, edges } = buildTestData();
    const name2EdgesIn = edges.reduce(
      (db, edge) => {
        const targetName = typeof edge.target === 'object' ? edge.target.id : edge.target;
        if (db[targetName]) {
          db[targetName].push(edge);
        } else {
          console.error(`Edge points to unknown node: ${targetName}`);
        }
        return db;
      },
      // initialize emptyDb - include nodes that have no incoming edges (leaves)
      nodes.reduce((emptyDb, node) => { const res = emptyDb; res[node.id] = []; return res; }, {}),
    );
    const hierarchy = getTreeHierarchy(findRoot(nodes, edges), name2EdgesIn);
    expect(hierarchy.get('project').size).toBe(7);
    expect(hierarchy.get('b').size).toBe(6);
    expect(hierarchy.get('c').size).toBe(2);
    expect(hierarchy.get('d').size).toBe(1);
    expect(hierarchy.get('a').size).toBe(1);
    expect(hierarchy.get('x').size).toBe(1);
    expect(hierarchy.get('y').size).toBe(1);
  });

  it('knows how to order nodes breadth first', () => {
    const { nodes, edges, expectedTree } = buildTestData();
    const { bfOrder, treeLevel2Names, name2Level } = nodesBreadthFirst(nodes, edges);
    expect(bfOrder.length).toBe(nodes.length - 1); // node z is floating ...
    expect(treeLevel2Names.length).toBe(expectedTree.length);
    for (let i = 0; i < treeLevel2Names.length; i += 1) {
      expect(treeLevel2Names[i].length).toBe(expectedTree[i].length);
    }
    expect(name2Level.d).toBe(3); // d on level 3
    for (let level = 0; level < treeLevel2Names.length; level += 1) {
      treeLevel2Names[level].forEach(
        (nodeName) => {
          expect(name2Level[nodeName]).toBe(level);
        },
      );
    }
  });

  it('assigns positions to nodes', () => {
    const { nodes, edges } = buildTestData();
    assignNodePositions(nodes, edges);
    nodes.filter(nd => nd.position).forEach(
      (node) => {
        const { treeLevel2Names, name2Level } = nodesBreadthFirst(nodes, edges);

        expect(Array.isArray(node.position)).toBe(true);
        expect(node.position[0] > 0 && node.position[0] <= 1).toBe(true);
        expect(node.position[1] > 0 && node.position[1] <= 1).toBe(true);
        expect(node.positionIndex[1]).toBe(name2Level[node.id]);
        expect(treeLevel2Names[node.positionIndex[1]][node.positionIndex[0]]).toBe(node.id);
      },
    );
  });

  it('can organize nodes into rows', () => {
    const { nodes, edges } = buildTestData();
    assignNodePositions(nodes, edges, { numPerRow: 2 });
    // up to 2 nodes per row, root on own row
    const maxRows = 1 + Math.round((nodes.length - 1) / 2);
    nodes.filter(nd => nd.position).forEach(
      (node) => {
        expect(Array.isArray(node.position)).toBe(true);
        expect(node.position[0] > 0 && node.position[0] <= 1).toBe(true);
        expect(node.position[1] > 0 && node.position[1] <= 1).toBe(true);
        expect(node.positionIndex[0] < 2).toBe(true); // at most 2 nodes per row
        expect(node.positionIndex[1]).toBeLessThan(maxRows);
      },
    );
  });
});
