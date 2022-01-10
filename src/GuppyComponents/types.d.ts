export type OptionFilter = {
  selectedValues: string[];
  __combineMode?: 'AND' | 'OR';
};

export type RangeFilter = {
  lowerBound: number;
  upperBound: number;
};

export type SimpleFilterState = {
  [x: string]: OptionFilter | RangeFilter;
};

export type AnchoredFilterState = {
  filter: SimpleFilterState;
};

export type FilterState = {
  [x: string]: OptionFilter | RangeFilter | AnchoredFilterState;
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

export type GqlSimpleAndFilter = {
  AND: GqlSimpleFilter[];
};

export type GqlSimpleFilter = GqlInFilter | GqlRangeFilter | GqlSimpleAndFilter;

export type GqlNestedFilter = {
  nested: {
    path: string;
    AND: GqlFilter[];
  };
};

export type GqlAndFilter = {
  AND: GqlFilter[];
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
  tabs: FilterTabsOption[];
};

export type GuppyConfig = {
  dataType: string;
  nodeCountTitle: string;
  fieldMapping?: {
    field: string;
    name: string;
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

export type FilterChangeHandler = (args: {
  anchorValue?: string;
  filter: FilterState;
}) => void;

export type GuppyData = {
  accessibleCount: number;
  aggsChartData: SimpleAggsData;
  aggsData: AggsData;
  allFields: string[];
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
  }) => Promise<void>;
  onAnchorValueChange: (anchorValue: string) => void;
  onFilterChange: FilterChangeHandler;
};
