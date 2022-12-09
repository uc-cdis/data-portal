/* eslint-disable import/prefer-default-export */


export const pseudoTw = {
  "flexRow": {
    display: "flex",
    flexDirection: "row"
  },
  "flexCol": {
    display: "flex",
    flexDirection: "column"
  },
  textCenter: {
    textAlign: "center",
  },
  "w-inherit": {
    width: "inherit"
  },
  "mx-auto": {
    margin: "0 auto"
  },
  "my-auto": {
    margin: "auto 0"
  },
  "m-auto": {
    margin: "auto"
  },
  "h-550": {
    height: 550
  },
  "h-fit": {
    height: "fit-content"
  },
  "w-full": {
    width: "100%"
  },
  justifyBetween: {
    justifyContent: "space-between"
  },
  oneThirdWidth: {
    width: "33%"
  }
}


export const gwasV2Steps = [
  {
    title: 'Select Study Population',
    secondaryTitle: 'Edit Study Population',
  },
  {
    title: 'Select Outcome Phenotype',
    secondaryTitle: 'Edit Outcome Phenotype',
  },
  {
    title: 'Select Covariate Phenotype',
    secondaryTitle: 'Edit Covariate Phenotype',
  },
  {
    title: 'Configure GWAS',
    secondaryTitle: 'Configure GWAS',
  },
];

export const initialState = {
  outcome: {},
  selectedStudyPopulationCohort: {},
  covariates: [],
  imputationScore: 0.3,
  mafThreshold: 0.01,
  numOfPC: 3,
  gwasName: '',
  selectedHare: { concept_value: '' },
  currentStep: 0,
};
