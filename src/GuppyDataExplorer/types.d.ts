export type {
  FilterConfig,
  FilterState as ExplorerFilters,
  GqlSort,
  GuppyConfig,
  GuppyData,
  OptionFilter,
  SimpleAggsData,
} from '../GuppyComponents/types';

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

export type SingleExplorerConfig = {
  adminAppliedPreFilters?: {
    [x: string]: OptionFilter;
  };
  buttons: SingleButtonConfig[];
  charts: ChartConfig;
  dropdowns?: DropdownsConfig;
  filters: FilterConfig;
  getAccessButtonLink?: string;
  guppyConfig: GuppyConfig;
  hideGetAccessButton?: boolean;
  id: number;
  label?: string;
  patientIds?: PatientIdsConfig;
  sevenBridgesExportURL?: string;
  survivalAnalysis: SurvivalAnalysisConfig;
  table: TableConfig;
  terraExportURL?: string;
  terraTemplate?: string[];
};

export type AlteredExplorerConfig = {
  adminAppliedPreFilters?: {
    [x: string]: OptionFilter;
  };
  buttonConfig: ButtonConfig;
  chartConfig: ChartConfig;
  filterConfig: FilterConfig;
  getAccessButtonLink?: string;
  guppyConfig: GuppyConfig;
  hideGetAccessButton?: boolean;
  patientIdsConfig?: PatientIdsConfig;
  survivalAnalysisConfig: SurvivalAnalysisConfig & { enabled: Boolean };
  tableConfig: TableConfig;
};

export type ExplorerFilterSet = {
  description: string;
  explorerId?: number;
  filters: ExplorerFilters;
  id?: number;
  name: string;
};
