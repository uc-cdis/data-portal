import React from 'react';
import { render } from '@testing-library/react';
import DataDictionaryPropertyTable from './index';

const properties = {
  prop1: { description: 'test 1', type: 't1' },
  prop2: { description: 'test 2', type: 't2' },
};
const requiredProps = ['prop1'];

test('renders', () => {
  const { container } = render(
    <DataDictionaryPropertyTable
      properties={properties}
      requiredProperties={requiredProps}
    />
  );
  expect(container.firstElementChild).toHaveClass(
    'data-dictionary-property-table'
  );
  expect(
    container.querySelectorAll('.data-dictionary-property-table__required')
  ).toHaveLength(requiredProps.length);
});
