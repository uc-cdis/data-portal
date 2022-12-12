/* eslint-disable import/prefer-default-export */
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

/* eslint-disable import/prefer-default-export */
export const pseudoTw = {
  flex: {
    direction: (dir) => ({
      display: 'flex',
      flexDirection: dir,
    }),
  },
  text: {
    align: (pos) => ({
      textAlign: pos,
    }),
    color: (c) => ({
      color: c,
    }),
  },
  width: {
    size: (w) => ({
      width: w,
    }),
  },
  height: {
    size: (h) => ({
      height: h,
    }),
  },
  margin: {
    auto: (...args) => {
      if (args[0] === 'default') return { margin: 'auto' };
      const { length } = args;
      return length === 1 ? {
        margin: args[0] === 'x' ? '0 auto' : 'auto 0',
      }
        : {
          margin: args[0] === 'x'
            ? `${args[1]} auto` : `auto ${args[1]}`,
        };
    },
  },
  bg: {
    color: (c) => ({
      backgroundColor: c,
    }),
  },
  justifyBetween: {
    justifyContent: 'space-between',
  },
};
