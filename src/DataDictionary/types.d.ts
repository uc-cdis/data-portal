export type GraphStyleConfig = {
  nodeContentPadding: number;
  nodeIconRadius: number;
  nodeTextFontSize: number;
  nodeTextLineGap: number;
};

export type GraphBoundingBox = [number, number][];

export type GraphEdge = {
  controlPoints?: [number, number][];
  pathString?: string;
  required?: boolean;
  source: string;
  target: string;
};

export type GraphLink = {
  source: GraphEdge['source'];
  target: GraphEdge['target'];
};

export type GraphNode = {
  id: string;
  type: string;
  boundingBox: { [key in 'x1' | 'x2' | 'y1' | 'y2']: number };
  topCenterX: number;
  topCenterY: number;
  width: number;
  height: number;
  color: string;
  iconRadius: GraphStyleConfig['nodeIconRadius'];
  textPadding: GraphStyleConfig['nodeContentPadding'];
  fontSize: GraphStyleConfig['nodeTextFontSize'];
  textLineGap: GraphStyleConfig['nodeTextLineGap'];
  names: string[];
  label: name;
  level: number;
  outLinks: string[];
  inLinks: string[];
  _gvid: number;
  requiredPropertiesCount: number;
  optionalPropertiesCount: number;
};

export type GraphLayout = {
  nodes: GraphNode[];
  edges: GraphEdge[];
  graphBoundingBox: GraphBoundingBox;
};

export type GraphvizLayout = {
  _draw_: { op: string; points?: [number, number][] }[];
  edges: {
    _draw_: { points: [number, number] }[];
    head: number;
    tail: number;
  }[];
  objects: (
    | {
        _draw_: { points: [number, number] }[];
        _gvid: number;
        label: string;
        name: string;
        type: string;
      }
    | {
        _gvid: number;
        name: string;
        rank: string;
      }
  )[];
};

export type SearchItemProperty = {
  description: string;
  name: string;
  type: string | string[];
};

export type SearchItem = {
  id: GraphNode['id'];
  title: string;
  description: string;
  properties: SearchItemProperty[];
};

export type SearchHistoryItem = {
  keywordStr: string;
  matchedCount: number;
};

export type MatchedItem = {
  arrayIndex: number;
  indices: number[][];
  key: string;
  value: string;
};

export type MatchedResult = {
  item: SearchItem;
  matches: MatchedItem[];
};

export type DdgraphState = {
  dataModelStructure: {
    nodeID: string;
    nodeIDsBefore: string[];
    linksBefore: GraphEdge[];
    category: string;
  }[];
  canvasBoundingRect: Partial<DOMRectReadOnly>;
  currentSearchKeyword: string;
  dataModelStructureRelatedNodeIDs?: GraphNode['id'][];
  dataModelStructureAllRoutesBetween?: string[][];
  edges: GraphEdge[];
  graphBoundingBox: GraphBoundingBox;
  graphNodesSVGElements: { [x: string]: SVGSVGElement };
  graphvizLayout: GraphvizLayout;
  highlightingMatchedNodeID: GraphNode['id'];
  highlightingMatchedNodeOpened: boolean;
  highlightingNode: GraphNode;
  hoveringNode: GraphNode;
  isGraphView: boolean;
  isSearchMode: boolean;
  isSearching: boolean;
  layoutInitialized: boolean;
  legendItems: string[];
  matchedNodeIDs: GraphNode['id'][];
  matchedNodeIDsInNameAndDescription: GraphNode['id'][];
  matchedNodeIDsInProperties: GraphNode['id'][];
  needReset: boolean;
  nodes: GraphNode[];
  overlayPropertyHidden: boolean;
  pathRelatedToSecondHighlightingNode?: GraphEdge[];
  relatedNodeIDs: GraphNode['id'][];
  routesBetweenStartEndNodes?: string[][];
  searchHistoryItems: SearchHistoryItem[];
  searchResult: MatchedResult[];
  secondHighlightingNodeID: GraphNode['id'];
  secondHighlightingNodeCandidateIDs?: GraphNode['id'];
  tableExpandNodeID: GraphNode['id'];
};
