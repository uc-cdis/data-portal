const TourSteps = [
    {
        selector: '[data-tour="first-step-1"]',
        content: 'You may only see cohorts that you have access to. Please select only one cohort. The size of the cohort population is indicated in the right hand side of the table. To browse the table please scroll down to the bottom'
     },
    {
        selector: '[data-tour="first-step-2"]',
        content: 'This button will open a new tab in your browser, outside of the Gen3 GWAS App and send you to OHDSI Atlas App',
    },
    {
        selector: '[data-tour="cohort-table"]',
        content: 'The table is sorted by size of cohort',
    },
    {
        selector: '[data-tour="first-step-4"]',
        content: 'Use this search bar to look for existing cohorts by name. This is a word based search that can look for letters/words within the name of the cohort',
    },
    {
      selector: '[data-tour="cohort-table-body"]',
      content: 'Navigate through the pages via the arrow buttons or by clicking on the page number. Please use the per page button on the bottom right to expand/reduce the amount of cohorts shown in each page',
    },
];

export default TourSteps;