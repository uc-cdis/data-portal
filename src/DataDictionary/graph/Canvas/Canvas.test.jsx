import React from 'react';
import { mount } from 'enzyme';
import Canvas from './Canvas';
import GraphDrawer from '../GraphDrawer/GraphDrawer';

const resizeWindow = (x, y) => {
  window.innerWidth = x;
  window.innerHeight = y;
  window.dispatchEvent(new Event('resize'));
};

describe('Canvas', () => {
  const resizeFunc = jest.fn();
  const clickFunc = jest.fn();
  const resetFunc = jest.fn();
  const canvas = mount(
    <Canvas
      onCanvasBoundingBoxUpdate={resizeFunc}
      onClickBlankSpace={clickFunc}
      onResetCanvasFinished={resetFunc}
    >
      <GraphDrawer className='text-drawer' />
    </Canvas>,
  );

  it('can render content inside canvas', () => {
    expect(canvas.find(Canvas).length).toBe(1);
    expect(canvas.find('.text-drawer').length).toBe(1);
  });

  it('can update canvas bounding box when resize window', () => {
    expect(resizeFunc.mock.calls.length).toBe(1);
    resizeWindow(100, 100);
    expect(resizeFunc.mock.calls.length).toBe(2);
  });

  it('can detect clicking on the blank space', () => {
    canvas.find('.canvas__overlay').simulate('click');
    expect(clickFunc.mock.calls.length).toBe(1);
  });

  it('can reset zoom if need', () => {
    canvas.setProps({ needReset: true });
    expect(resetFunc.mock.calls.length).toBe(1);
  });
});
