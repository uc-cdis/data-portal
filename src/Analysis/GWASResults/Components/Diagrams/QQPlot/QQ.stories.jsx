import React from 'react';
import QQPlot from './QQPlot';
import largeJsonDataFile from '../../../TestData/Diagrams/QQPlotData/LargeQQPlotTestData.json';
import smallJsonDataFile from '../../../TestData/Diagrams/QQPlotData/SmallQQPlotTestData.json';

export default {
  title: 'Tests2/GWASResults/Components/Diagrams/QQPlot',
  component: QQPlot,
};

const Template = (args) => (
  <div
    style={{
      width: '450px',
      margin: '30px auto',
    }}
  >
    <QQPlot {...args} />
  </div>
);

export const SmallPlot = Template.bind({});
SmallPlot.args = {
  qq_plot_container_id: 'dummydiv1',
  maf_ranges: smallJsonDataFile.by_maf,
  qq_ci: smallJsonDataFile.ci,
};

export const LargerPlot = Template.bind({});
LargerPlot.args = {
  qq_plot_container_id: 'dummydiv2',
  maf_ranges: largeJsonDataFile.by_maf,
  qq_ci: largeJsonDataFile.ci,
};

export const ErrorScenario = Template.bind({});
ErrorScenario.args = {};
