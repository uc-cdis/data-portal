import React from 'react';
import ManhattanPlot from './ManhattanPlot';
import largeJsonDataFile from '../../../TestData/Diagrams/ManhattanPlotTestDataLarge.json';
import smallJsonDataFile from '../../../TestData/Diagrams/ManhattanPlotTestDataSmall.json';

export default {
  title: 'Tests2/GWASResults/Components/Diagrams/ManhattanPlot',
  component: ManhattanPlot,
};

const Template = (args) => <ManhattanPlot {...args} />;

export const SmallPlot = Template.bind({});
// Tiny data subset from https://pheweb.org/UKB-TOPMed/api/manhattan/pheno/557.1.json:
SmallPlot.args = {manhattan_plot_container_id: 'dummydiv1', ...smallJsonDataFile};

export const LargerPlot = Template.bind({});
// COPY OF https://pheweb.org/UKB-TOPMed/api/manhattan/pheno/557.1.json:
LargerPlot.args = {manhattan_plot_container_id: 'dummydiv2', ...largeJsonDataFile};

export const ErrorScenario = Template.bind({});
ErrorScenario.args = {};
