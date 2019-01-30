import React from 'react';
import { mount } from 'enzyme';
import NodePopup from './NodePopup';

describe('NodePopup', () => {
  const highlightingNode = {
    id: 'a',
    type: 'test',
    requiredPropertiesCount: 0,
    optionalPropertiesCount: 0,
  };
  it('can render popup', () => {
    const closeFunc = jest.fn();
    const openFunc = jest.fn();
    const fakeSVGElem = mount(<g />);
    const svgElems = { a: fakeSVGElem };
    const popup = mount(
      <NodePopup
        highlightingNode={highlightingNode}
        graphNodesSVGElements={svgElems}
        onClosePopup={closeFunc}
        onOpenOverlayPropertyTable={openFunc}
      />,
    );
    expect(popup.find('.node-popup__wrapper').length).toBe(1);
    const openPropertyButtonElem = popup.find('.node-popup__button').first();
    openPropertyButtonElem.simulate('click');
    expect(openFunc.mock.calls.length).toBe(1);
    const closeButtonElem = popup.find('.node-popup__close').first();
    closeButtonElem.simulate('click');
    expect(closeFunc.mock.calls.length).toBe(1);
  });
});
