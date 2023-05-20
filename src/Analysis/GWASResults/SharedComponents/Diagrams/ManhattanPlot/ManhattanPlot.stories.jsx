import React from 'react';
import ManhattanPlot from './ManhattanPlot';
import jsonDataFile from '../../../TestData/ManhattanPlotTestData.json';

export default {
  title: 'Tests2/GWASResults/SharedComponents/Diagrams/ManhattanPlot',
  component: ManhattanPlot,
};

const Template = (args) => <ManhattanPlot {...args} />;

export const SmallPlot = Template.bind({});
// Tiny data subset from https://pheweb.org/UKB-TOPMed/api/manhattan/pheno/557.1.json:
SmallPlot.args = {
  variant_bins: [
    {
      "chrom": "6",
      "qvals": [
          4.75
      ],
      "qval_extents": [
          [
              0.05,
              4.15
          ],
          [
              4.35,
              4.55
          ]
      ],
      "pos": 32400000
  },
  {
      "chrom": "6",
      "qvals": [
          4.75
      ],
      "qval_extents": [
          [
              0.05,
              4.15
          ],
          [
              4.35,
              4.55
          ]
      ],
      "pos": 32800000
  }],
  unbinned_variants: [
    {
      "chrom": "6",
      "pos": 32418606,
      "ref": "A",
      "alt": "G",
      "rsids": "rs2187819",
      "nearest_genes": "BTNL2",
      "consequence": "intergenic_variant",
      "pval": 0.0,
      "beta": 2.0,
      "sebeta": 0.0,
      "af": 0.18,
      "case_af": 0.48,
      "control_af": 0.18,
      "tstat": 1100.0
  },
  {
      "chrom": "6",
      "pos": 32711549,
      "ref": "C",
      "alt": "T",
      "rsids": "rs9275576",
      "nearest_genes": "HLA-DQA2",
      "consequence": "upstream_gene_variant",
      "pval": 0.0,
      "beta": 2.7,
      "sebeta": 0.0,
      "af": 0.15,
      "case_af": 0.48,
      "control_af": 0.14,
      "tstat": 1200.0
  }],
};

export const LargerPlot = Template.bind({});
// COPY OF https://pheweb.org/UKB-TOPMed/api/manhattan/pheno/557.1.json:
LargerPlot.args = jsonDataFile;

export const ErrorScenario = Template.bind({});
ErrorScenario.args = {};
