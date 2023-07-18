import React from 'react';
import QQPlot from './QQPlot';
import largeJsonDataFile from '../../../TestData/Diagrams/QQPlotData/LargeQQPlotTestData.json';
import smallJsonDataFile from '../../../TestData/Diagrams/QQPlotData/SmallQQPlotTestData.json';

export default {
  title: 'Tests2/GWASResults/Components/Diagrams/QQPlot',
  component: QQPlot,
};

const Template = (args) => <QQPlot {...args} />;

export const SmallPlot = Template.bind({});
// Tiny data subset from https://pheweb.org/UKB-TOPMed/api/manhattan/pheno/557.1.json:
SmallPlot.args = {
  qq_plot_container_id: 'dummydiv1',
  maf_ranges: smallJsonDataFile.by_maf,
  qq_ci: smallJsonDataFile.ci,
};

export const LargerPlot = Template.bind({});
// COPY OF https://pheweb.org/UKB-TOPMed/api/manhattan/pheno/557.1.json:
LargerPlot.args = {
  qq_plot_container_id: 'dummydiv2',

  maf_ranges: largeJsonDataFile.by_maf,
  qq_ci: largeJsonDataFile.ci,
};

export const ErrorScenario = Template.bind({});
ErrorScenario.args = {};
