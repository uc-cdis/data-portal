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

export const attritionTableHeaderConfig = [
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
    align: 'center',
  },
  /*  {
    title: 'Chart',
    dataIndex: 'chart',
    key: 'chart',
    align: 'center',
  }, */
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    align: 'center',
  },
  {
    title: 'Size',
    dataIndex: 'size',
    key: 'size',
    align: 'center',
  },
  {
    title: 'Non-Hispanic Black',
    dataIndex: 'nonHispanicBlack',
    key: 'nonHispanicBlack',
    align: 'center',
    width: '18%',
  },
  {
    title: 'Non-Hispanic Asian',
    dataIndex: 'nonHispanicAsian',
    key: 'nonHispanicAsian',
    align: 'center',
    width: '18%',
  },
  {
    title: 'Non-Hispanic White',
    dataIndex: 'nonHispanicWhite',
    key: 'nonHispanicWhite',
    align: 'center',
    width: '18%',
  },
  {
    title: 'Hispanic',
    dataIndex: 'hispanic',
    key: 'hispanic',
    align: 'center',
    width: '18%',
  },
];

export const headerDataSource = [
  {
    type: '',
    name: '',
    size: '',
    nonHispanicBlack: '',
    nonHispanicAsian: '',
    nonHispanicWhite: '',
    hispanic: '',
  },
];
