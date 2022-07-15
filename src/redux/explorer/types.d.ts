import type {
  FilterConfig,
  GuppyConfig,
  OptionFilter,
} from '../../GuppyComponents/types';
import type {
  ButtonConfig,
  ChartConfig,
  ExplorerFilter,
  ExplorerFilterSet,
  PatientIdsConfig,
  SurvivalAnalysisConfig,
  TableConfig,
} from '../../GuppyDataExplorer/types';
import type {
  ParsedSurvivalAnalysisResult,
  SurvivalAnalysisResult,
} from '../../GuppyDataExplorer/ExplorerSurvivalAnalysis/types';

export type ExplorerConfig = {
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

export type ExplorerFilter = ExplorerFilter;

export type ExplorerFilterSet = ExplorerFilterSet;

export type UnsavedExplorerFilterSet = {
  filter: ExplorerFilterSet['filter'];
  id?: never;
  name?: never;
  description?: never;
};

export type ExplorerWorkspace = {
  activeId: string;
  all: {
    [id: string]: ExplorerFilterSet | UnsavedExplorerFilterSet;
  };
};

export type ExplorerState = {
  config: ExplorerConfig;
  explorerFilter: ExplorerFilter;
  explorerId: number;
  explorerIds: ExplorerState['explorerId'][];
  patientIds: string[];
  savedFilterSets: {
    data: ExplorerFilterSet[];
    isError: boolean;
  };
  survivalAnalysisResult: {
    data: SurvivalAnalysisResult;
    error: Error;
    isPending: boolean;
    parsed: ParsedSurvivalAnalysisResult;
  };
  workspaces: {
    [explorerId: ExplorerState['explorerId']]: ExplorerWorkspace;
  };
};
