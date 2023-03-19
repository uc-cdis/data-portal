export const DEFAULT_INTERVAL = 1;
export const DEFAULT_END_YEAR = 5;

/** @typedef {import('./types').DisallowedVariable} DisallowedVariable */
/** @type {DisallowedVariable[]} */
export const DISALLOWED_VARIABLES = [
  {
    label: 'Data Contributor',
    field: 'data_contributor_id',
  },
  {
    label: 'Study',
    field: 'studies.study_id',
  },
  {
    label: 'Treatment Arm',
    field: 'treatment_arm',
  },
];
