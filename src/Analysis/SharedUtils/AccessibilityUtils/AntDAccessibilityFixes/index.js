import SetDOMAttribute from './SetDOMAttribute';

const delayToAllowDOMRendering = 500;
const addAriaLabelsToCohortDefinationsTable = () => {
  SetDOMAttribute(
    '.GWASUI-mainTable input.ant-radio-input',
    'aria-label',
    'Select row for study population',
  );
};

const addAriaLabelsToCovariatesTable = () => {
  console.log('called');
  setTimeout(() => {
    SetDOMAttribute(
      '.continuous-covariates-table input.ant-radio-input',
      'aria-label',
      'Select row for outcome phenotype',
    );
  }, delayToAllowDOMRendering);
};

export {
  addAriaLabelsToCohortDefinationsTable,
  addAriaLabelsToCovariatesTable,
};
