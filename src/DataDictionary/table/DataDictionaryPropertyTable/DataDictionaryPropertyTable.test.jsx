import React from 'react';
import { mount } from 'enzyme';
import DataDictionaryPropertyTable from './.';

describe('DataDictionaryPropertyTable', () => {
  const properties = {
    prop1: { description: 'test 1', type: 't1' },
    prop2: { description: 'test 2', type: 't2' },
  };
  const requiredProps = ['prop1'];
  const wrapper = mount(
    <DataDictionaryPropertyTable
      properties={properties}
      requiredProperties={requiredProps}
    />,
  );

  it('can render', () => {
    expect(wrapper.find(DataDictionaryPropertyTable).length).toBe(1);
    expect(wrapper.find('.data-dictionary-property-table__required').length).toBe(requiredProps.length);
  });
});
