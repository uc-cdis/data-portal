import SetDOMAttribute from './SetDOMAttribute';

const addAriaLabelsToCohortDefinationsTable = () => {
  console.log(Math.random());
  SetDOMAttribute(
    '.GWASUI-table1 input.ant-radio-input',
    'aria-label',
    'Select row for study population'
  );
};
export { addAriaLabelsToCohortDefinationsTable };
