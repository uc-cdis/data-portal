export const caseControlTourSteps = {
  0: [
    {
      selector: '[data-tour="attrition-table"]',
      content: 'This dropdown menu will show you the attrition table. In which, every selection you make will populate the total size of the study population that has ancestry data, and the ancestry breakdown inside this population',
    },
    {
      selector: '[data-tour="step-1-cohort-selection"]',
      content: 'You may only see cohorts that you have access to. Please select only one cohort. The size of the cohort population is indicated in the right hand side of the table. To browse the table please scroll down to the bottom',
    },
    {
      selector: '[data-tour="step-1-new-cohort"]',
      content: 'This button will open a new tab in your browser, outside of the Gen3 GWAS App and send you to OHDSI Atlas App',
    },
    {
      selector: '[data-tour="cohort-table"]',
      content: 'The table is sorted by size of cohort',
    },
    {
      selector: '[data-tour="cohort-table-search"]',
      content: 'Use this search bar to look for existing cohorts by name. This is a word based search that can look for letters/words within the name of the cohort',
    },
    {
      selector: '[data-tour="cohort-table-body"]',
      content: 'Navigate through the pages via the arrow buttons or by clicking on the page number. Please use the per page button on the bottom right to expand/reduce the amount of cohorts shown in each page',
    },
    {
      selector: '[data-tour="next-button"]',
      content: 'Please press next to continue to the next steps',
    },
  ],
  1: [
    {
      selector: '[data-tour="step-2-cohort-selection"]',
      content: 'You may only see cohorts that you have access to. Please select only one cohort. You cannot select the same cohort as step 1',
    },
    {
      selector: '[data-tour="cohort-table"]',
      content: 'The table is sorted by size of cohort',
    },
    {
      selector: '[data-tour="cohort-table-search"]',
      content: 'Use this search bar to look for existing cohorts by name. This is a word based search that can look for letters/words within the name of the cohort',
    },
    {
      selector: '[data-tour="cohort-table-body"]',
      content: 'Navigate through the pages via the arrow buttons or by clicking on the page number. Please use the per page button on the bottom right to expand/reduce the amount of cohorts shown in each page',
    },
    {
      selector: '[data-tour="next-button"]',
      content: 'Please press next to continue to the next steps',
    },
  ],
  2: [
    {
      selector: '[data-tour="step-3-choosing-variable"]',
      content: 'Please choose as many variables as you wish, you may remove them later in the pipeline. Currently, only continuous variables can be selected. All variables are harmonized. To browse the table please scroll down to the bottom',
    },
    {
      selector: '[data-tour="covariate-table"]',
      content: 'The table is sorted by variable name',
    },
    {
      selector: '[data-tour="covariate-table-search"]',
      content: 'Use this search bar to look for existing variables by name. This is a word based search that can look for letters/words within the name of the variable name',
    },
    {
      selector: '[data-tour="covariate-table-body"]',
      content: 'Navigate through the pages via the arrow buttons or by clicking on the page number. Please use the per page button on the bottom right to expand/reduce the amount of cohorts shown in each page',
    },
    {
      selector: '[data-tour="next-button"]',
      content: 'Please press next to continue to the next steps',
    },
  ],
  3: [
    {
      selector: '[data-tour="step-4-review"]',
      content: 'Here you can review variables you chose. All data are harmonized from different projects through the collaborative development of a data dictionary. In the right hand side of the table a missing % is calculated. This is to reflect how many subjects of the chosen population do not have this information available. To browse the table please scroll down to the bottom',
    },
    {
      selector: '[data-tour="covariates-table"]',
      content: 'On the right hand side of the table a missing % is calculated. The % missing column reflects the percent of missing data out of the population chosen for this variable',
    },
    {
      selector: '[data-tour="next-button"]',
      content: 'Please press next to continue to the next steps',
    },
  ],
  4: [
    {
      selector: '[data-tour="choosing-dichotomous"]',
      content: 'You may add a custom dichotomous covariate here by selecting two cohorts. Please combine a cohort for YES and a cohort for NO. This step is not mandatory',
    },
    {
      selector: '[data-tour="name"]',
      content: 'Once cohorts are selected please enter a name for the covariate and press "Add" before moving to the next screen',
    },
    {
      selector: '[data-tour="add-button"]',
      content: 'You may add dichotomous covariates as many times as you need, and remove created covariates on the right hand side',
    },
    {
      selector: '[data-tour="table-repeat"]',
      content: 'Both tables behave the same as the select cohort table in step 1. Please refer to step 1 tutorial',
    },
    {
      selector: '[data-tour="next-button"]',
      content: 'Please press next to continue to the next steps',
    },
  ],
  5: [
    {
      selector: '[data-tour="number-of-pcs"]',
      content: 'Population Principal components (PCs) refer to linear combinations of genome-wide genotyping data to control for population structure/stratification (select up to 10 PCs)',
    },
    {
      selector: '[data-tour="covariates"]',
      content: 'Please review the chosen covariates. You may remove unwanted covariates, or go back (at the bottom of the page) to step 2 to choose different ones',
    },
    {
      selector: '[data-tour="hare"]',
      content: 'Please choose the ancestry population on which you would like to perform your study. The numbers appearing in the dropdown represent the population size of your study, considering all of your previous selections. The codes are the HARE (harmonized ancestry and race/ethnicity) codes',
    },
    {
      selector: '[data-tour="maf-cutoff"]',
      content: 'Minor allele frequency (MAF) is the frequency at which the second most common allele occurs in a given population and can be used to filter out rare markers (scale of 0-0.5)',
    },
    {
      selector: '[data-tour="imputation-score"]',
      content: 'This value reflects the quality of imputed SNPs and can be used to remove low-quality imputed markers (scale of 0-1)',
    },
    {
      selector: '[data-tour="next-button"]',
      content: 'Please press next to continue to the next steps',
    },
  ],
  6: [
    {
      selector: '[data-tour="review-metadata"]',
      content: 'Please review the metadata selected for the study. You may adjust parameters by going back to previous steps and changing the values',
    },
    {
      selector: '[data-tour="review-name"]',
      content: '‘Please enter the name for your study. Upon submission the name will appear in the ‘Submitted Job Status’ area',
    },
    {
      selector: '[data-tour="review-submit-button"]',
      content: 'Please click ‘Submit’ button when you are ready to submit the study',
    },
  ],
};

export const quantitativeTourSteps = {
  0: [
    {
      selector: '[data-tour="attrition-table"]',
      content: 'This dropdown menu will show you the attrition table. In which, every selection you make will populate the total size of the study population that has ancestry data, and the ancestry breakdown inside this population',
    },
    {
      selector: '[data-tour="quant-step-1-cohort-selection"]',
      content: 'You may only see cohorts that you have access to. Please select only one cohort. The size of the cohort population is indicated in the right hand side of the table. To browse the table please scroll down to the bottom',
    },
    {
      selector: '[data-tour="quant-step-1-new-cohort"]',
      content: 'This button will open a new tab in your browser, outside of the Gen3 GWAS App and send you to OHDSI Atlas App',
    },
    {
      selector: '[data-tour="cohort-table"]',
      content: 'The table is sorted by size of cohort',
    },
    {
      selector: '[data-tour="cohort-table-search"]',
      content: 'Use this search bar to look for existing cohorts by name. This is a word based search that can look for letters/words within the name of the cohort',
    },
    {
      selector: '[data-tour="cohort-table-body"]',
      content: 'Navigate through the pages via the arrow buttons or by clicking on the page number. Please use the per page button on the bottom right to expand/reduce the amount of cohorts shown in each page',
    },
    {
      selector: '[data-tour="next-button"]',
      content: 'Please press next to continue to the next steps',
    },
  ],
  1: [
    {
      selector: '[data-tour="quant-step-2-choosing-variable"]',
      content: 'Please choose as many variables as you wish, you may remove them later in the pipeline. Currently, only continuous variables can be selected. All variables are harmonized. To browse the table please scroll down to the bottom',
    },
    {
      selector: '[data-tour="covariate-table"]',
      content: 'The table is sorted by variable name',
    },
    {
      selector: '[data-tour="covariate-table-search"]',
      content: 'Use this search bar to look for existing variables by name. This is a word based search that can look for letters/words within the name of the variable name',
    },
    {
      selector: '[data-tour="covariate-table-body"]',
      content: 'Navigate through the pages via the arrow buttons or by clicking on the page number. Please use the per page button on the bottom right to expand/reduce the amount of cohorts shown in each page',
    },
    {
      selector: '[data-tour="next-button"]',
      content: 'Please press next to continue to the next steps',
    },
  ],
  2: [
    {
      selector: '[data-tour="choosing-covariates"]',
      content: 'Here you may select your phenotype among the variables you previously chose. The table is sorted by variable name. To browse the table please scroll down to the bottom',
    },
    {
      selector: '[data-tour="covariates-table"]',
      content: 'On the right hand side of the table a missing % is calculated. The % missing column reflects the percent of missing data out of the population chosen for this variable',
    },
    {
      selector: '[data-tour="covariates-table-search"]',
      content: 'Use this search bar to look for existing variables by name. This is a word based search that can look for letters/words within the name of the variable name',
    },
    {
      selector: '[data-tour="covariates-table-body"]',
      content: 'Navigate through the pages via the arrow buttons or by clicking on the page number. Please use the per page button on the bottom right to expand/reduce the amount of cohorts shown in each page',
    },
    {
      selector: '[data-tour="next-button"]',
      content: 'Please press next to continue to the next steps',
    },
  ],
  3: [
    {
      selector: '[data-tour="choosing-dichotomous"]',
      content: 'You may add a custom dichotomous covariate here by selecting two cohorts. Please combine a cohort for YES and a cohort for NO. This step is not mandatory',
    },
    {
      selector: '[data-tour="name"]',
      content: 'Once cohorts are selected please enter a name for the covariate and press "Add" before moving to the next screen',
    },
    {
      selector: '[data-tour="add-button"]',
      content: 'You may add dichotomous covariates as many times as you need, and remove created covariates on the right hand side',
    },
    {
      selector: '[data-tour="table-repeat"]',
      content: 'Both tables behave the same as the select cohort table in step 1. Please refer to step 1 tutorial',
    },
    {
      selector: '[data-tour="next-button"]',
      content: 'Please press next to continue to the next steps',
    },
  ],
  4: [
    {
      selector: '[data-tour="number-of-pcs"]',
      content: 'Population Principal components (PCs) refer to linear combinations of genome-wide genotyping data to control for population structure/stratification (select up to 10 PCs)',
    },
    {
      selector: '[data-tour="covariates"]',
      content: 'Please review the chosen covariates. You may remove unwanted covariates, or go back (at the bottom of the page) to step 2 to choose different ones',
    },
    {
      selector: '[data-tour="hare"]',
      content: 'Please choose the ancestry population on which you would like to perform your study. The numbers appearing in the dropdown represent the population size of your study, considering all of your previous selections. The codes are the HARE (harmonized ancestry and race/ethnicity) codes',
    },
    {
      selector: '[data-tour="maf-cutoff"]',
      content: 'Minor allele frequency (MAF) is the frequency at which the second most common allele occurs in a given population and can be used to filter out rare markers (scale of 0-0.5)',
    },
    {
      selector: '[data-tour="imputation-score"]',
      content: 'This value reflects the quality of imputed SNPs and can be used to remove low-quality imputed markers (scale of 0-1)',
    },
    {
      selector: '[data-tour="next-button"]',
      content: 'Please press next to continue to the next steps',
    },
  ],
  5: [
    {
      selector: '[data-tour="review-metadata"]',
      content: 'Please review the metadata selected for the study. You may adjust parameters by going back to previous steps and changing the values',
    },
    {
      selector: '[data-tour="review-name"]',
      content: '‘Please enter the name for your study. Upon submission the name will appear in the ‘Submitted Job Status’ area',
    },
  ],
};
