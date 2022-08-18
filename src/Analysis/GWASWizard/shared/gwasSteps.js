export const caseControlTourSteps = {
  0: [
    {
      selector: '[data-tour="step-1-cohort-selection"]',
      content: 'You may only see cohorts that you have access to. Please select only one cohort. The size of the cohort population is indicated in the right hand side of the table. To browse the table please scroll down to the bottom.',
    },
    {
      selector: '[data-tour="step-1-new-cohort"]',
      content: 'This button will open a new tab in your browser, outside of the Gen3 GWAS App and send you to OHDSI Atlas App.',
    },
  ],
  2: [
    {
      selector: '[data-tour="step-3-choosing-variable"]',
      content: 'Please choose as many variables as you wish, you may remove them later in the pipeline. Currently, only continuous variables can be selected. All variables are harmonized. To browse the table please scroll down to the bottom.',
    },
  ],
  5: [
    {
      selector: '[data-tour="number-of-pcs"]',
      content: 'Population Principal components (PCs) refer to linear combinations of genome-wide genotyping data to control for population structure/stratification (select up to 10 PCs)',
    },
    {
      selector: '[data-tour="covariates"]',
      content: 'Please review the chosen covariates. You may remove unwanted covariates, or go back (at the bottom of the page) to step 2 to choose different ones.',
    },
    {
      selector: '[data-tour="hare"]',
      content: 'Please choose the ancestry population on which you would like to perform your study. The numbers appearing in the dropdown represent the population size of your study, considering all of your previous selections. The codes are the HARE (harmonized ancestry and race/ethnicity) codes.',
    },
    {
      selector: '[data-tour="maf-cutoff"]',
      content: 'Minor allele frequency (MAF) is the frequency at which the second most common allele occurs in a given population and can be used to filter out rare markers (scale of 0-0.5) ',
    },
    {
      selector: '[data-tour="imputation-score"]',
      content: 'This value reflects the quality of imputed SNPs and can be used to remove low-quality imputed markers (scale of 0-1)',
    },
  ],
};

export const quantitativeTourSteps = {
  0: [
    {
      selector: '[data-tour="quant-step-1-cohort-selection"]',
      content: 'You may only see cohorts that you have access to. Please select only one cohort. The size of the cohort population is indicated in the right hand side of the table. To browse the table please scroll down to the bottom.',
    },
    {
      selector: '[data-tour="quant-step-1-new-cohort"]',
      content: 'This button will open a new tab in your browser, outside of the Gen3 GWAS App and send you to OHDSI Atlas App.',
    },
  ],
  1: [
    {
      selector: '[data-tour="quant-step-2-choosing-variable"]',
      content: 'Please choose as many variables as you wish, you may remove them later in the pipeline. Currently, only continuous variables can be selected. All variables are harmonized. To browse the table please scroll down to the bottom.',
    },
  ],
  4: [
    {
      selector: '[data-tour="number-of-pcs"]',
      content: 'Population Principal components (PCs) refer to linear combinations of genome-wide genotyping data to control for population structure/stratification (select up to 10 PCs)',
    },
    {
      selector: '[data-tour="covariates"]',
      content: 'Please review the chosen covariates. You may remove unwanted covariates, or go back (at the bottom of the page) to step 2 to choose different ones.',
    },
    {
      selector: '[data-tour="hare"]',
      content: 'Please choose the ancestry population on which you would like to perform your study. The numbers appearing in the dropdown represent the population size of your study, considering all of your previous selections. The codes are the HARE (harmonized ancestry and race/ethnicity) codes.',
    },
    {
      selector: '[data-tour="maf-cutoff"]',
      content: 'Minor allele frequency (MAF) is the frequency at which the second most common allele occurs in a given population and can be used to filter out rare markers (scale of 0-0.5) ',
    },
    {
      selector: '[data-tour="imputation-score"]',
      content: 'This value reflects the quality of imputed SNPs and can be used to remove low-quality imputed markers (scale of 0-1)',
    },
  ],
};
