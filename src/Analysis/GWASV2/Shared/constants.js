/* eslint-disable import/prefer-default-export */
export const gwasV2Steps = [
  {
    title: 'Select Study Population',
    secondaryTitle: 'Edit Study Population',
  },
  {
    title: 'Select Outcome Phenotype',
    secondaryTitle: 'Edit Outcome Phenotype',
  },
  {
    title: 'Select Covariate Phenotype',
    secondaryTitle: 'Edit Covariate Phenotype',
  },
  {
    title: 'Configure GWAS',
    secondaryTitle: 'Configure GWAS',
  },
];

export const gwas = {
  outcome: {},
  selectedStudyPopulationCohort: {},
  allCovariates: [],
  imputationScore: 0.3,
  mafThreshold: 0.01,
  numOfPC: 3,
  gwasName: '',
  selectedHare: { concept_value: '' },
  current: 0
}
