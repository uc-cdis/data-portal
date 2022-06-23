// TODO put antd/query configs in here

export const allowedConceptTypes = {
    ConceptTypes: ['MVP Continuous'],
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

export const cohortSelection = (handler, selectedCohort, caseCohortName) => {
    return {
        type: 'radio',
        columnTitle: 'Select',
        selectedRowKeys: (selectedCohort) ? [selectedCohort.cohort_definition_id] : [],
        onChange: (_, selectedRows) => {
            handler(selectedRows[0]);
        },
        getCheckboxProps: (record) => ({
            disabled: record.size === 0 || record.cohort_name === caseCohortName,
        }),
    }
}

export const covariateSelection = (handler, selectedCovariates) => {
    return {
        type: 'checkbox',
        columnTitle: 'Select',
        selectedRowKeys: selectedCovariates.map((val) => val.concept_id),
        onChange: (_, selectedRows) => {
            handler(selectedRows);
        },
    };
}

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

export const chooseCovariateCaption = (
    <div>
        <p>Please choose as many variables as you wish, you may remove them later in the pipeline. Currently, only continuous variables can be selected. All variables are harmonized. To browse the table please scroll down to the bottom.</p>
    </div>
);
