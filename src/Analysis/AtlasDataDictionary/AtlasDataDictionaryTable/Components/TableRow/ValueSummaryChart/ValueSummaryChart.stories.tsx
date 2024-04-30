import React from 'react';
import ValueSummaryChart from './ValueSummaryChart';
import TableData from '../../../TestData/TableData';
import PreprocessTableData from '../../../Utils/PreprocessTableData';
import NumericValueSummaryChartData from '../../../TestData/NumericValueSummaryChartData';
import { IValueSummary } from '../../../Interfaces/Interfaces';
import '../../../../AtlasDataDictionary.css';

export default {
  title: 'Tests2/AtlasDataDictionary/Components/ValueSummaryChart',
  component: 'AtlasDataDictionaryContainer',
};

const processedTableData = PreprocessTableData(TableData);
const firstNumericValueSummaryData = processedTableData.find(
  (obj) => obj.valueStoredAs === 'Number',
)?.valueSummary;
const firstNonNumericValueSummaryData = processedTableData.find(
  (obj) => obj.valueStoredAs !== 'Number',
)?.valueSummary;
const PreviewArgs = {
  chartData: firstNumericValueSummaryData as IValueSummary[],
  preview: true,
  chartType: 'Number',
};
const NonNumericArgs = {
  chartData: firstNonNumericValueSummaryData as IValueSummary[],
  preview: false,
  chartType: 'Concept Id',
};
const NumericArgs = {
  chartData: firstNumericValueSummaryData as IValueSummary[],
  preview: false,
  chartType: 'Number',
};
const NumericDifferentDataArgs = {
  chartData: NumericValueSummaryChartData as IValueSummary[],
  preview: false,
  chartType: 'Number',
};
const PreviewTemplate = () => (
  <div className='atlas-data-dictionary-container'>
    <ValueSummaryChart {...PreviewArgs} />
  </div>
);
const NonNumericTemplate = () => (
  <div className='atlas-data-dictionary-container'>
    <ValueSummaryChart
      {...NonNumericArgs}
    />
  </div>
);
const NumericTemplate = () => (
  <div className='atlas-data-dictionary-container'>
    <ValueSummaryChart
      {...NumericArgs}
    />
  </div>
);
const NumericValueSummaryDifferentDataTemplate = () => (
  <div className='atlas-data-dictionary-container'>
    <ValueSummaryChart
      {...NumericDifferentDataArgs}
    />
  </div>
);

export const NumericValueSummary = NumericTemplate.bind({});
export const NumericValueSummaryDifferentData = NumericValueSummaryDifferentDataTemplate.bind({});
export const NonNumericValueSummary = NonNumericTemplate.bind({});
export const PreviewValueSummary = PreviewTemplate.bind({});
