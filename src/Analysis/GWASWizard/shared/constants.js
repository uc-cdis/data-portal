// TODO put antd/query configs in here

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
      description: 'Set workflow parameters and remove unwanted covariates',
    },
    {
      title: 'Step 5',
      description: 'Submit GWAS job',
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
        description: 'Set workflow parameters and remove unwanted covariates',
    },
    {
        title: 'Step 6',
        description: 'Submit GWAS job',
    },
];

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
