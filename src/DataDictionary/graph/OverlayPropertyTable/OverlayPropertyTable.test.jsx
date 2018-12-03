import React from 'react';
import { mount } from 'enzyme';
import OverlayPropertyTable from './OverlayPropertyTable';

describe('OverlayPropertyTable', () => {
  const node = {
    id: 'a',
    category: 'test',
    title: 'node A',
    description: 'node A description',
    required: [],
    properties: {},
  };
  it('can render overlay property table correctly', () => {
    const hiddenTable1 = mount(
      <OverlayPropertyTable
        node={null}
        hidden={false}
      />,
    );
    expect(hiddenTable1.find('.overlay-property-table').length).toBe(0);

    const hiddenTable2 = mount(
      <OverlayPropertyTable
        node={node}
        hidden
      />,
    );
    expect(hiddenTable2.find('.overlay-property-table').length).toBe(0);

    const closeFunc = jest.fn();
    const table = mount(
      <OverlayPropertyTable
        node={node}
        hidden={false}
        onCloseOverlayPropertyTable={closeFunc}
      />,
    );
    expect(table.find('.overlay-property-table').length).toBe(1);
    const closeButtonElem = table.find('.overlay-property-table__close').first();
    closeButtonElem.simulate('click');
    expect(closeFunc.mock.calls.length).toBe(1);
  });
});
