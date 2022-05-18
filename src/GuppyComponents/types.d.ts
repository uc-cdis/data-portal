export type OptionFilter = {
  selectedValues?: string[];
  __combineMode?: 'AND' | 'OR';
};

export type RangeFilter = {
  lowerBound?: number;
  upperBound?: number;
};

export type SimpleFilterState = {
  [x: Exclude<string, '__combineMode'>]: OptionFilter | RangeFilter;
  __combineMode?: 'AND' | 'OR';
};

export type AnchoredFilterState = {
  filter: SimpleFilterState;
};

export type FilterState = {
  [x: Exclude<string, '__combineMode'>]:
    | OptionFilter
    | RangeFilter
    | AnchoredFilterState;
  __combineMode?: 'AND' | 'OR';
};

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

export type GqlSimpleAndFilter =
  | {
      AND: GqlSimpleFilter[];
    }
  | {
      OR: GqlSimpleFilter[];
    };

export type GqlSimpleFilter = GqlInFilter | GqlRangeFilter | GqlSimpleAndFilter;

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

export type GqlAndFilter =
  | {
      AND: GqlFilter[];
    }
  | {
      OR: GqlFilter[];
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
  | GqlAndFilter
  | GqlSearchFilter;

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
