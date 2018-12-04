import React from 'react';
import { mount } from 'enzyme';
import NodeTooltip from './NodeTooltip';

describe('NodeTooltip', () => {
  const hoveringNode = {
    id: 'a',
    type: 'test',
    label: 'node A',
  };
  it('can render tooltip', () => {
    const tooltip = mount(
      <NodeTooltip
        hoveringNode={hoveringNode}
      />,
    );
    expect(tooltip.find('.node-tooltip__wrapper').length).toBe(1);
    const tooltipWithoutHoveringNode = mount(
      <NodeTooltip
        hoveringNode={null}
      />,
    );
    expect(tooltipWithoutHoveringNode.find('.node-tooltip__wrapper').length).toBe(0);
  });
});
