/* eslint-disable import/prefer-default-export */


export const pseudoTw = {
  "flex": {
    direction: (dir) => {
      return {
        display: "flex",
        flexDirection: dir
      }
  }},
  text: {
    align: (pos) => {
      return {
        textAlign: pos
      }
    },
    color: (c) => {
      return {
        color : c
      }
    }
  },
  "width": {
    size: (w) => {
      return {
        width: w
      }
    }
  },
  "height": {
    size: (h) => {
      return {
        height: h
      }
    }
  },
  "margin": {
    auto: (...args) => {
      if (args[0] === "default") return { margin: "auto" }
      let { length } = args;
      return length === 1 ? {
        margin: args[0] === "x" ? "0 auto" : "auto 0"
      }
      : {
          margin: args[0] === "x" ?
          `${args[1]} auto` : `auto ${args[1]}`
       }
    }
  },
  bg: {
    color: (c) => {
      return {
        backgroundColor: c
      }
    }
  },
  justifyBetween: {
    justifyContent: "space-between"
  },
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
