type CombineMode = 'AND' | 'OR';

export type EmptyFilter = { __type?: never };

export type OptionFilter = {
  __combineMode?: CombineMode;
  __type: 'OPTION';
  isExclusion?: boolean;
  selectedValues?: string[];
};

export type RangeFilter = {
  __type: 'RANGE';
  lowerBound?: number;
  upperBound?: number;
};

export type BaseFilter = EmptyFilter | OptionFilter | RangeFilter;

export type AnchoredFilterState = {
  __type: 'ANCHORED';
  value?: {
    [x: string]: BaseFilter;
  };
};

export type StandardFilterState = {
  __combineMode?: CombineMode;
  __type?: 'STANDARD';
  value?: {
    [x: string]: BaseFilter | AnchoredFilterState;
  };
};

export type ComposedFilterState = {
  __combineMode?: CombineMode;
  __type: 'COMPOSED';
  value?: (ComposedFilterState | StandardFilterState)[];
};

export type FilterState = ComposedFilterState | StandardFilterState;

export type GqlInFilter = {
  IN: {
    [x: string]: string[];
  };
};

export type GqlRangeFilter = {
  GTE?: {
    [x: string]: number;
  };
  LTE?: {
    [x: string]: number;
  };
};

export type GqlNotFilter = {
  '!=': {
    [x: string]: string;
  };
};

export type GqlSimpleFilter =
  | GqlInFilter
  | GqlRangeFilter
  | GqlNotFilter
  | { AND: GqlSimpleFilter[] }
  | { OR: GqlSimpleFilter[] };

export type GqlNestedAnchoredFilter = {
  nested: {
    path: string;
    AND:
      | [GqlInFilter]
      | [GqlInFilter, { AND: GqlFilter[] } | { OR: GqlFilter[] }];
  };
};

export type GqlNestedFilter =
  | GqlNestedAnchoredFilter
  | {
      nested:
        | {
            path: string;
            AND: GqlFilter[];
          }
        | {
            path: string;
            OR: GqlFilter[];
          };
    };

export type GqlSearchFilter = {
  search: {
    keyword: string;
    fields: string[];
  };
};

export type GqlFilter =
  | GqlSimpleFilter
  | GqlNestedFilter
  | GqlSearchFilter
  | { AND: GqlFilter[] }
  | { OR: GqlFilter[] };

export type GqlSort = { [x: string]: 'asc' | 'desc' }[];

export type AnchorConfig = {
  field: string;
  options: string[];
  tabs: string[];
  tooltip?: string;
};

export type FilterTabsOption = {
  title: string;
  fields: string[];
  searchFields?: string[];
};

export type FilterConfig = {
  anchor?: AnchorConfig;
  info?: /* runtime only */ {
    [field: string]: {
      label: string;
      tooltip?: string;
    };
  };
  tabs: FilterTabsOption[];
};

export type GuppyConfig = {
  dataType: string;
  nodeCountTitle: string;
  fieldMapping?: {
    field: string;
    name?: string;
    tooltip?: string;
  }[];
  manifestMapping?: {
    resourceIndexType: string;
    resourceIdField: string;
    referenceIdFieldInResourceIndex: string;
    referenceIdFieldInDataIndex: string;
  };
  getAccessButtonLink?: string;
  terraExportURL?: string;
  mainField?: string;
  mainFieldTitle?: string;
  mainFieldIsNumeric?: boolean;
  aggFields?: string[];
  downloadAccessor?: string;
  fileCountField?: string;
};

export type AggsTextCount = {
  count: number;
  key: string;
  accessible?: any;
};

export type AggsRangeCount = {
  count: number;
  key: [number, number];
  accessible?: any;
};

export type AggsCount = AggsRangeCount | AggsTextCount;

export type SimpleAggsData = {
  [x: string]: {
    histogram: AggsCount[];
  };
};

export type AggsData = {
  [x: string]:
    | {
        histogram: AggsCount[];
      }
    | SimpleAggsData;
};

export type FilterChangeHandler = (filter: FilterState) => void;

export type GuppyData = {
  accessibleCount: number;
  aggsChartData: SimpleAggsData;
  aggsData: AggsData;
  allFields: string[];
  anchorValue: string;
  filter: FilterState;
  initialTabsOptions?: SimpleAggsData;
  isLoadingAggsData: boolean;
  isLoadingRawData: boolean;
  rawData: any[];
  tabsOptions: SimpleAggsData;
  totalCount: number;
  downloadRawData: (args: { format: string; sort: GqlSort }) => Promise<void>;
  downloadRawDataByFields: (args: {
    fields: string[];
    sort: GqlSort;
  }) => Promise<void>;
  downloadRawDataByTypeAndFilter: (
    type: string,
    filter: FilterState,
    fields: string[]
  ) => Promise<void>;
  getTotalCountsByTypeAndFilter: (
    type: string,
    filter: FilterState
  ) => Promise<void>;
  fetchAndUpdateRawData: (args: {
    offset: number;
    size: number;
    sort: GqlSort;
  }) => Promise<any>;
  onAnchorValueChange: (anchorValue: string) => void;
  onFilterChange: FilterChangeHandler;
};
