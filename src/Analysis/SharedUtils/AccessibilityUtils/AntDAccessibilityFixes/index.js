import SetDOMAttribute from './SetDOMAttribute';

const addAriaLabelsToCohortDefinationsTable = () => {
  SetDOMAttribute(
    '.GWASUI-mainTable input.ant-radio-input',
    'aria-label',
    'Select row for study population'
  );
};

const addAriaLabelsToCovariatesTable = () => {
  SetDOMAttribute(
    '.continuous-covariates-table input.ant-radio-input',
    'aria-label',
    'Select row for outcome phenotype'
  );
};

export {
  addAriaLabelsToCohortDefinationsTable,
  addAriaLabelsToCovariatesTable,
};
