import { FilterState, GqlFilter } from '../GuppyComponents/types';

export type {
  FilterConfig,
  GqlSort,
  GuppyConfig,
  GuppyData,
  OptionFilter,
  SimpleAggsData,
} from '../GuppyComponents/types';

export type ExplorerFilter = FilterState;

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
  result?: {
    risktable?: boolean;
    survival?: boolean;
  };
};

export type ExplorerFilterSet = {
  description: string;
  explorerId?: number;
  filter: ExplorerFilter;
  id?: number;
  name: string;
};

export type ExplorerFilterSetDTO = {
  description: string;
  explorerId?: number;
  filters: ExplorerFilter;
  gqlFilter: GqlFilter;
  id?: number;
  name: string;
};
