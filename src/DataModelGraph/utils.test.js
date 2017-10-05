import { assignNodePositions, createNodesAndEdges, findRoot, nodesBreadthFirst } from './utils';

describe('the DataModelGraph utils helper', () => {
  function buildTestData() {
    const nodes = ['project', 'a', 'b', 'c', 'd', 'x', 'y'].map(name => ({ name }));
    const edges = [
      { source: 'b', target: 'project' },
      { source: 'a', target: 'b' }, { source: 'c', target: 'b' },
      { source: 'x', target: 'b' }, { source: 'y', target: 'b' },
      { source: 'd', target: 'c' }, { source: 'd', target: 'project' },
    ];
    return { nodes, edges };
  }

  it('can find the root of a graph', () => {
    const { nodes, edges } = buildTestData();
    expect(findRoot(nodes, edges)).toBe('project');
  });

  it('extracts nodes and edges from a dictionary', () => {
    const testDict = {
      program: {
        type: 'object',
        links: [{ target_type: 'a' }],
      },
      a: {
        type: 'object',
        links: [
          { target_type: 'b' },
          { target_type: 'c' },
        ],
      },
      b: {
        type: 'object',
        links: [
          { target_type: 'c' },
        ],
      },
      c: {
        type: 'object',
      },
    };
    const { nodes, edges } = createNodesAndEdges({ dictionary: testDict }, true);
    expect(nodes.length).toBe(3); // program is "hidden"
    expect(edges.length).toBe(3);
  });

  it('knows how to order nodes breadth first', () => {
    const { nodes, edges } = buildTestData();
    const { bfOrder, treeLevel2Names, name2Level } = nodesBreadthFirst(nodes, edges);
    console.log('tree info', treeLevel2Names);
    expect(bfOrder.length).toBe(nodes.length);
    expect(treeLevel2Names.length).toBe(3); // 'd' should fall under 'project' with 'b'
    expect(treeLevel2Names[0].length).toBe(1); // project
    expect(treeLevel2Names[1].length).toBe(2); // b, d
    expect(treeLevel2Names[2].length).toBe(4); // a, c, x, y
    expect(name2Level.d).toBe(1); // d on level 1
    for (let level=0; level < treeLevel2Names.length; ++level) {
      treeLevel2Names[level].forEach(
        (nodeName) => {
          expect(name2Level[nodeName]).toBe(level);
        }
      );
    }
  });

  it('assigns positions to nodes', () => {
    const { nodes, edges } = buildTestData();
    assignNodePositions(nodes, edges);
    nodes.forEach(
      (node) => {
        const { treeLevel2Names, name2Level } = nodesBreadthFirst(nodes, edges);

        expect(Array.isArray(node.position)).toBe(true);
        expect(node.position[0] > 0 && node.position[0] <= 1).toBe(true);
        expect(node.position[1] > 0 && node.position[1] <= 1).toBe(true);
        expect(node.positionIndex[1]).toBe(name2Level[node.name]);
        expect(treeLevel2Names[node.positionIndex[1]][node.positionIndex[0]]).toBe(node.name);
      }
    );
  });

  it('can organize nodes into rows', () => {
    const { nodes, edges } = buildTestData();
    assignNodePositions(nodes, edges, { numPerRow: 2 });
    const maxRows = 1 + Math.round((nodes.length-1) / 2); // up to 2 nodes per row, root on own row
    nodes.forEach(
      (node) => {
        expect(Array.isArray(node.position)).toBe(true);
        expect(node.position[0] > 0 && node.position[0] <= 1).toBe(true);
        expect(node.position[1] > 0 && node.position[1] <= 1).toBe(true);
        expect(node.positionIndex[0] < 2).toBe(true); // at most 2 nodes per row
        expect(node.positionIndex[1] < maxRows).toBe(true);
      }
    );
  });
});
