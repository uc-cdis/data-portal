export type { GqlFilter } from '../../GuppyComponents/types';
export type { ExplorerFilterSet, SavedExplorerFilterSet } from '../types';

export type ColorScheme = {
  [key: string]: string;
};

export type RisktableDataPoint = {
  nrisk: number;
  time: number;
};

export type RisktableData = {
  data: RisktableDataPoint[];
  name: string;
};

export type SurvivalDataPoint = {
  prop: number;
  time: number;
};

export type SurvivalData = {
  data: SurvivalDataPoint[];
  name: string;
};

export type SurvivalResultForFilterSet = {
  name: string;
  count: {
    fitted: number;
    total: number;
  };
  risktable: RisktableDataPoint[];
  survival: SurvivalDataPoint[];
};

export type SurvivalAnalysisResult = {
  [id: string]: SurvivalResultForFilterSet;
};

export type ParsedSurvivalAnalysisResult = {
  count?: {
    [name: string]: SurvivalResultForFilterSet['count'];
  };
  risktable?: RisktableData[];
  survival?: SurvivalData[];
};

export type UserInput = {
  timeInterval: number;
  startTime: number;
  endTime: number;
  efsFlag: boolean;
  usedFilterSets: SavedExplorerFilterSet[];
};

export type UserInputSubmitHandler = (userInput: UserInput) => void;

export type DisallowedVariable = {
  label: string;
  field: string;
}