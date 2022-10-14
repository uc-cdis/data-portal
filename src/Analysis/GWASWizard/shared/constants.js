export const hareConceptId = 2000007027;

export const gwasStatus = {
  pending: 'Pending',
  running: 'Running',
  succeeded: 'Succeeded',
  failed: 'Failed',
  error: 'Error',
};

export const quantitativeSteps = [
  {
    title: 'Step 1',
    description: 'Select a cohort for GWAS',
  },
  {
    title: 'Step 2',
    description: 'Select harmonized variables for phenotypes and covariates',
  },
  {
    title: 'Step 3',
    description: 'Select which variable is your phenotype',
  },
  {
    title: 'Step 4',
    description: 'Add custom dichotomous covariates (optional)',
  },
  {
    title: 'Step 5',
    description: 'Set workflow parameters and remove unwanted covariates',
  },
  {
    title: 'Step 6',
    description: 'Review and submit your GWAS study',
  },
];

export const caseControlSteps = [
  {
    title: 'Step 1',
    description: 'Select a case cohort for GWAS',
  },
  {
    title: 'Step 2',
    description: 'Select a control cohort for GWAS',
  },
  {
    title: 'Step 3',
    description: 'Select harmonized variables for covariates',
  },
  {
    title: 'Step 4',
    description: 'Assess % missing in selected covariates',
  },
  {
    title: 'Step 5',
    description: 'Add custom dichotomous covariates (optional)',
  },
  {
    title: 'Step 6',
    description: 'Set workflow parameters and remove unwanted covariates',
  },
  {
    title: 'Step 7',
    description: 'Review and submit your GWAS study',
  },
];

export const cohortSelection = (handler, selectedCohort, otherCohortSelected) => ({
  type: 'radio',
  columnTitle: 'Select',
  selectedRowKeys: (selectedCohort) ? [selectedCohort.cohort_definition_id] : [],
  onChange: (_, selectedRows) => {
    handler(selectedRows[0]);
  },
  getCheckboxProps: (record) => ({
    disabled: record.size === 0 || record.cohort_name === otherCohortSelected,
  }),
});

export const covariateSelection = (handler, selectedCovariates) => ({
  type: 'checkbox',
  columnTitle: 'Select',
  selectedRowKeys: selectedCovariates.map((val) => val.concept_id),
  onChange: (_, selectedRows) => {
    handler(selectedRows);
  },
});

export const outcomeSelection = (handler, outcome) => ({
  type: 'radio',
  columnTitle: 'Select',
  selectedRowKeys: (outcome) ? [outcome.concept_id] : [],
  onChange: (_, selectedRows) => {
    handler(selectedRows[0]);
  },
});

export const cohortTableConfig = [
  {
    title: 'Cohort Name',
    dataIndex: 'cohort_name',
    key: 'cohort_name',
  },
  {
    title: 'Size',
    dataIndex: 'size',
    key: 'size',
  },
];

export const covariateTableConfig = [
  {
    title: 'Concept ID',
    dataIndex: 'concept_id',
    key: 'concept_name',
  },
  {
    title: 'Concept Name',
    dataIndex: 'concept_name',
    key: 'concept_name',
    filterSearch: true,
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

export const attritionTableHeaderConfig = [
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
    align: 'center',
  },
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
