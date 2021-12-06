import { fireEvent, render } from '@testing-library/react';
import Canvas from './Canvas';
import GraphDrawer from '../GraphDrawer/GraphDrawer';

const resizeWindow = (x, y) => {
  window.innerWidth = x;
  window.innerHeight = y;
  window.dispatchEvent(new Event('resize'));
};

function renderComponent(props) {
  return render(
    <Canvas {...props}>
      <GraphDrawer layoutInitialized />
    </Canvas>
  );
}

test('renders content inside canvas', () => {
  const { container } = renderComponent();
  expect(container.firstElementChild).toHaveClass('canvas');
  expect(container.querySelector('.canvas__container').childElementCount).toBe(
    1
  );
});

test('updates canvas bounding box when resize window', () => {
  const onCanvasBoundingBoxUpdate = jest.fn();
  renderComponent({ onCanvasBoundingBoxUpdate });
  expect(onCanvasBoundingBoxUpdate).toHaveBeenCalledTimes(1);

  resizeWindow(100, 100);
  expect(onCanvasBoundingBoxUpdate).toHaveBeenCalledTimes(2);
});

test('detects clicking on the blank space', () => {
  const onClickBlankSpace = jest.fn();
  const { container } = renderComponent({ onClickBlankSpace });

  fireEvent.click(container.querySelector('.canvas__overlay'));
  expect(onClickBlankSpace).toHaveBeenCalledTimes(1);
});

test('resets zoom if needed', () => {
  const onResetCanvasFinished = jest.fn();
  renderComponent({ onResetCanvasFinished, needReset: true });
  expect(onResetCanvasFinished).toHaveBeenCalledTimes(1);
});
