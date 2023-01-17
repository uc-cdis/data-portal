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
        }
    ]
};

export default TourSteps;