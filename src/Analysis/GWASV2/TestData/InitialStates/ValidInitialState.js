const ValidInitialState = {
  outcome: {
    variable_type: 'concept',
    concept_id: 2000000873,
    concept_name: 'Attribute8',
  },
  selectedStudyPopulationCohort: {
    cohort_definition_id: 404,
    cohort_name: 'Catch All (do not run generate)',
    size: 510904,
  },
  covariates: [
    {
      variable_type: 'custom_dichotomous',
      provided_name: 'test dichotomous covariate',
      concept_id: 2000000123,
    },
    {
      variable_type: 'concept',
      concept_id: 2000000873,
      concept_name: 'Attribute81',
    },
    {
      variable_type: 'concept',
      concept_id: 2000000873,
      concept_name: 'Attribute82',
    },
    {
      variable_type: 'concept',
      concept_id: 2000000873,
      concept_name: 'Attribute83',
    },
  ],
  imputationScore: 0.5,
  mafThreshold: 0.1,
  numOfPCs: 5,
  gwasName: 'Example GWAS Name',
  selectedHare: {
    concept_value: 'EUR',
    concept_value_as_concept_id: 2000007031,
    concept_value_name: 'non-Hispanic White',
  },
  currentStep: 3,
  finalPopulationSizes: [
    {
      population: 'Total',
      size: 97277,
    },
  ],
};
export default ValidInitialState;
