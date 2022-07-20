import type { Response as PaginateResponse } from 'react-select-async-paginate';

export type {
  AnchorConfig,
  AnchoredFilterState,
  FilterChangeHandler,
  FilterConfig,
  FilterState,
  FilterTabsOption,
  BaseFilter,
  EmptyFilter,
  OptionFilter,
  SimpleFilterState,
} from '../../../GuppyComponents/types';

export type EmptyFilterStatus = {};

export type OptionFilterStatus = {
  [option: string]: boolean;
};

export type RangeFilterStatus = [lowerBound: number, upperBound: number];

export type FilterSectionStatus =
  | EmptyFilterStatus
  | OptionFilterStatus
  | RangeFilterStatus;

export type FilterTabStatus = FilterSectionStatus[];

export type AnchoredFilterTabStatus = {
  [anchorLabel: string]: FilterTabStatus;
};

export type FilterStatus = (FilterTabStatus | AnchoredFilterTabStatus)[];

export type SingleSelectFilterOption = {
  accessible?: boolean;
  count: number;
  disabled?: boolean;
  filterType: 'singleSelect';
  text: string;
};

export type RangeFilterOption = {
  count?: number;
  filterType: 'range';
  max: number;
  min: number;
  rangeStep?: number;
  text?: string;
};

export type FilterSectionConfig = {
  isArrayField?: boolean;
  isSearchFilter?: boolean;
  onSearchFilterLoadOptions?: (
    searchString: string,
    offset: number
  ) => PaginateResponse<any, null, null>;
  options: SingleSelectFilterOption[] | RangeFilterOption[];
  title: string;
  tooltip?: string;
};
