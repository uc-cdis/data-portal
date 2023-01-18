const TourSteps = {
  0: [
    {
      selector: '[data-tour="cohort-intro"]',
      content: 'In this page you may select your starting study population',
    },
    {
      selector: '[data-tour="cohort-select"]',
      content: 'You may only see cohorts that you have access to. Please select only one cohort. The size of the cohort population is indicated in the right hand side of the table. To browse the table please scroll down to the bottom',
    },
    {
      selector: '[data-tour="cohort-add"]',
      content: 'This button will open a new tab in your browser, outside of the Gen3 GWAS App and send you to OHDSI Atlas App',
    },
    {
      selector: '[data-tour="cohort-table"]',
      content: 'The table is sorted by size of cohort',
    },
    {
      selector: '[data-tour="cohort-search"]',
      content: 'Use this search bar to look for existing cohorts by name. This is a word based search that can look for letters/words within the name of the cohort',
    },
    {
      selector: '[data-tour="cohort-table-body"]',
      content: 'Navigate through the pages via the arrow buttons or by clicking on the page number. Please use the per page button on the bottom right to expand/reduce the amount of cohorts shown in each page',
    },
    {
      selector: '[data-tour="attrition-table"]',
      content: 'Here you may see how your selection is populated as ancestry. This table will show you the population of your potential cohort as it relates to the ancestry you may choose as you make selections in the GWAS App',
    },
    {
      selector: '[data-tour="next-button"]',
      content: 'Please press Next to continue',
    },
  ],
  1: [
    {
      selector: '[data-tour="select-outcome"]',
      content: 'In this step you may choose your outcome phenotype. To edit previous steps please click ‘Previous’ or press the step number',
    },
    {
      selector: '[data-tour="select-outcome-continious"]',
      content: 'Please press here to select a continuous outcome phenotype. In pressing this option you’ll be able to select one of the contentious variables available to you as an outcome phenotype for your study population',
    },
    {
      selector: '[data-tour="select-outcome-dichotomous"]',
      content: 'Please press here to select a dichotomous outcome phenotype. In pressing this option you’ll be able to select two cohorts available to you to define your outcome phenotype. The population selected will be a subsection of your study population',
    },
  ],
  1.1: [
    {
      selector: '[data-tour="select-concept"]',
      content: 'Here you may choose one continuous variable. All variables are harmonized. To browse the table please scroll down to the bottom',
    },
    {
      selector: '[data-tour="search-bar"]',
      content: 'Use this search bar to look for existing variables by name. This is a word based search that can look for letters/words within the name of the variable name',
    },
    {
      selector: '[data-tour="concept-table"]',
      content: 'The table is sorted by variable name',
    },
    {
      selector: '[data-tour="select-concept"]',
      content: 'Navigate through the pages via the arrow buttons or by clicking on the page number. Please use the per page button on the bottom right to expand/reduce the amount of cohorts shown in each page',
    },
    {
      selector: '[data-tour="phenotype-histogram"]',
      content: 'This is an interactive tool. Here you may define the minimum and maximum cuttoffs of your variable. You may also use transformations on this data',
    },
    {
      selector: '[data-tour="submit-cancel-buttons"]',
      content: 'Please press cancel to go back, or submit to continue to the next step',
    },
    {
      selector: '[data-tour="attrition-table"]',
      content: 'Here you may see how your selection is populated as ancestry. This table will show you the population of your potential cohort as it relates to the ancestry you may choose as you make selections in the GWAS App. Please press the chart icon to revisit your adjusted selection',
    },
  ],
  1.2: [
    {
      selector: '[data-tour="select-dichotomous"]',
      content: 'You may select a dichotomous outcome phenotype here by selecting two cohorts. Please combine a cohort for value 0 and a cohort for value 1',
    },
    {
      selector: '[data-tour="cohorts-overlap-diagram"]',
      content: 'In this diagram you may see how the cohorts chosen interact with each other and with the study population you have selected in step 1',
    },
    {
      selector: '[data-tour="name-input"]',
      content: 'Please name your phenotype. We recommend you give a name that is meaningful so that you may revisit your analysis later',
    },
    {
      selector: '[data-tour="submit-cancel-buttons"]',
      content: 'Please press cancel to go back, or submit to continue to the next step',
    },
    {
      selector: '[data-tour="attrition-table"]',
      content: 'Here you may see how your selection is populated as ancestry. This table will show you the population of your potential cohort as it relates to the ancestry you may choose as you make selections in the GWAS App. Please press the chart icon to revisit the Euler diagram',
    },
  ],
  2: [
    {
      selector: '[data-tour="select-covariate"]',
      content: 'In this step you may add as many covariates as you wish. To edit previous steps please click ‘Previous’ or press the step number. This step is not mandatory',
    },
    {
      selector: '[data-tour="select-covariate-continious"]',
      content: 'Please press here to add a continuous covariate to your GWAS. In pressing this option you’ll be able to select one of the contentious variables available to you as covariate for your study population',
    },
    {
      selector: '[data-tour="select-covariate-dichotomous"]',
      content: 'Please press here to add a dichotomous covariate. In pressing this option you’ll be able to select two cohorts available to you to define a dichotomous covariate. The population selected will be a subsection of your study population',
    },
  ],
  2.1: [
    {
      selector: '[data-tour="select-concept"]',
      content: 'Here you may choose one continuous variable. All variables are harmonized. To browse the table please scroll down to the bottom',
    },

  ],
  2.2: [
    {
      selector: '[data-tour="select-dichotomous"]',
      content: 'You may select a dichotomous outcome phenotype here by selecting two cohorts. Please combine a cohort for value 0 and a cohort for value 1',
    },
  ],
  3: [
    {
      selector: '[data-tour="configure-gwas"]',
      content: 'In this step, you will determine workflow parameters. Please adjust the number of population principal components to control for population structure, minor allele frequency cutoff and imputation score cutoff. Please also choose the ancestry population on which you would like to perform your study.',
    },
    {
      selector: '[data-tour="configure-pcs"]',
      content: 'Population Principal components (PCs) refer to linear combinations of genome-wide genotyping data to control for population structure/stratification (select up to 10 PCs)',
    },
    {
      selector: '[data-tour="configure-maf"]',
      content: 'Minor allele frequency (MAF) is the frequency at which the second most common allele occurs in a given population and can be used to filter out rare markers (scale of 0-0.5)',
    }, {
      selector: '[data-tour="configure-hare"]',
      content: 'Please choose the ancestry population on which you would like to perform your study. The numbers appearing in the dropdown represent the population size of your study, considering all of your previous selections. The codes are the HARE (harmonized ancestry and race/ethnicity) codes',
    },
    {
      selector: '[data-tour="configure-imputation"]',
      content: 'This value reflects the quality of imputed SNPs and can be used to remove low-quality imputed markers (scale of 0-1)',
    },
  ],
};

export default TourSteps;
