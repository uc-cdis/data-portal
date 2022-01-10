export type { GqlFilter } from '../../GuppyComponents/types';
export type { ExplorerFilterSet } from '../types';

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
  risktable: RisktableDataPoint[];
  survival: SurvivalDataPoint[];
};

export type SurvivalAnalysisResult = {
  [id: string]: SurvivalResultForFilterSet;
};

export type UserInput = {
  timeInterval: number;
  startTime: number;
  endTime: number;
  efsFlag: boolean;
  usedFilterSets: ExplorerFilterSet[];
};

export type UserInputSubmitHandler = (userInput: UserInput) => void;
