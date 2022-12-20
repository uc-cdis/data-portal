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
