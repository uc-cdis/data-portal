import {
  ComposedFilterState,
  FilterState,
  GqlFilter,
  StandardFilterState,
} from '../GuppyComponents/types';

export type {
  FilterConfig,
  GqlSort,
  GuppyConfig,
  GuppyData,
  OptionFilter,
  SimpleAggsData,
} from '../GuppyComponents/types';

export type ExplorerFilter = FilterState;

export type RefFilterState = {
  __type: 'REF';
  value: {
    id: string;
    label: string;
  };
};

export interface ComposedFilterStateWithRef extends ComposedFilterState {
  refIds?: string[];
  value?: (ComposedFilterStateWithRef | StandardFilterState | RefFilterState)[];
}

export type SingleChartConfig = {
  chartType: string;
  showPercentage?: boolean;
  title: string;
};

export type ChartConfig = {
  [x: string]: SingleChartConfig;
};

export type SingleButtonConfig = {
  dropdownId?: string;
  enabled: boolean;
  fileName?: string;
  leftIcon?: string;
  rightIcon?: string;
  title: string;
  tooltipText?: string;
  type: string;
};

export type DropdownsConfig = {
  [x: string]: {
    title: string;
  };
};

export type ButtonConfig = {
  buttons: SingleButtonConfig[];
  dropdowns?: DropdownsConfig;
  sevenBridgesExportURL?: string;
  terraExportURL?: string;
  terraTemplate?: string[];
};

export type TableConfig = {
  enabled: boolean;
  fields?: string[];
  linkFields?: string[];
};

export type PatientIdsConfig = {
  export?: boolean;
  filter?: boolean;
};

export type SurvivalAnalysisConfig = {
  consortium?: string[];
  result?: {
    risktable?: boolean;
    survival?: boolean;
  };
};

export type SavedExplorerFilterSet = {
  description: string;
  explorerId?: number;
  filter: FilterState;
  id?: number;
  name: string;
};

export type UnsavedExplorerFilterSet = {
  description?: never;
  explorerId?: never;
  filter: ComposedFilterStateWithRef | StandardFilterState;
  id?: never;
  name?: never;
};

export type ExplorerFilterSet =
  | SavedExplorerFilterSet
  | UnsavedExplorerFilterSet;

export type ExplorerFilterSetDTO = {
  description: string;
  explorerId?: number;
  filters: ExplorerFilter;
  gqlFilter: GqlFilter;
  id?: number;
  name: string;
};
