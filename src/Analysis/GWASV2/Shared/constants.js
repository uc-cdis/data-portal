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

export const isEnterOrSpace = (event) =>
  event.key === 'Enter' ||
  event.key === ' ' ||
  event.key === 'Spacebar' ||
  event.keycode === '32' ||
  event.keycode === '13';
