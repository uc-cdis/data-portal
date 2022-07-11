import type {
  FilterConfig,
  GuppyConfig,
  OptionFilter,
} from '../GuppyComponents/types';
import type {
  ButtonConfig,
  ChartConfig,
  PatientIdsConfig,
  SurvivalAnalysisConfig,
  TableConfig,
} from '../../GuppyDataExplorer/types';

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

export type ExplorerState = {
  config: ExplorerConfig;
  explorerId: number;
  explorerIds: ExplorerState['explorerId'][];
};
