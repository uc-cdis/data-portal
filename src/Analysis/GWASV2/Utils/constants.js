/* eslint-disable import/prefer-default-export */
export const gwasV2Steps = [
  {
    title: 'Select Study Population',
  },
  {
    title: 'Select Outcome Phenotype',
  },
  {
    title: 'Select Covariate Phenotype',
  },
  {
    title: 'Configure GWAS',
  },
];

export const isEnterOrSpace = (event) => event.key === 'Enter'
  || event.key === ' '
  || event.key === 'Spacebar'
  || event.keycode === '32'
  || event.keycode === '13';

// TODO - move this and function above to a .js file with a clearer name?
export const formatNumber = (number) => (Math.round(number * 10) / 10).toLocaleString();

export const MESSAGES = {
  OVERLAP_ERROR: {
    title: 'Your selected cohorts should have some overlap with the study population',
    messageType: 'warning',
  },
  NO_BINS_ERROR: {
    title: 'None of the persons in the (remaining) population have a value for the selected concept',
    messageType: 'warning',
  },
};
