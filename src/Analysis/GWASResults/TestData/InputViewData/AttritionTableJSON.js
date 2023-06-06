const AttritionTableJSON = [
  {
    table_type: 'case',
    rows: [
      {
        type: 'cohort',
        name: 'Test cohortC - Large (do not run generate)',
        size: 200000,
        concept_breakdown: [
          {
            concept_value_name: 'non-Hispanic Black',
            persons_in_cohort_with_value: 39934,
          },
          {
            concept_value_name: 'non-Hispanic Asian',
            persons_in_cohort_with_value: 40050,
          },
          {
            concept_value_name: 'non-Hispanic White',
            persons_in_cohort_with_value: 80333,
          },
          {
            concept_value_name: 'Hispanic',
            persons_in_cohort_with_value: 39683,
          },
        ],
      },
      {
        type: 'outcome',
        name: 'Attribute7',
        size: 196080,
        concept_breakdown: [
          {
            concept_value_name: 'non-Hispanic Black',
            persons_in_cohort_with_value: 39148,
          },
          {
            concept_value_name: 'non-Hispanic Asian',
            persons_in_cohort_with_value: 39293,
          },
          {
            concept_value_name: 'non-Hispanic White',
            persons_in_cohort_with_value: 78742,
          },
          {
            concept_value_name: 'Hispanic',
            persons_in_cohort_with_value: 38897,
          },
        ],
      },
      {
        type: 'covariate',
        name: 'Attribute8',
        size: 192158,
        concept_breakdown: [
          {
            concept_value_name: 'non-Hispanic Black',
            persons_in_cohort_with_value: 38414,
          },
          {
            concept_value_name: 'non-Hispanic Asian',
            persons_in_cohort_with_value: 38525,
          },
          {
            concept_value_name: 'non-Hispanic White',
            persons_in_cohort_with_value: 77130,
          },
          {
            concept_value_name: 'Hispanic',
            persons_in_cohort_with_value: 38089,
          },
        ],
      },
      {
        type: 'covariate',
        name: 'Attribute9',
        size: 188237,
        concept_breakdown: [
          {
            concept_value_name: 'non-Hispanic Black',
            persons_in_cohort_with_value: 37607,
          },
          {
            concept_value_name: 'non-Hispanic Asian',
            persons_in_cohort_with_value: 37697,
          },
          {
            concept_value_name: 'non-Hispanic White',
            persons_in_cohort_with_value: 75624,
          },
          {
            concept_value_name: 'Hispanic',
            persons_in_cohort_with_value: 37309,
          },
        ],
      },
    ],
  },
];

export default AttritionTableJSON;
