import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { fireEvent, render } from '@testing-library/react';
import RangeFilter from './index';

const min = 0;
const max = 100;

function RangeFilterWrapper({ values = undefined, ...props }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current !== null && values !== undefined) {
      ref.current.onSliderChange(values);
    }
  }, [values]);

  return (
    <RangeFilter
      ref={ref}
      min={min}
      max={max}
      onAfterDrag={() => {}}
      {...props}
    />
  );
}
RangeFilterWrapper.propTypes = {
  values: PropTypes.arrayOf(PropTypes.number),
};

test('renders', () => {
  const { container } = render(
    <RangeFilter min={min} max={max} onAfterDrag={() => {}} />
  );
  expect(container.firstElementChild).toHaveClass('g3-range-filter');
});

test('sets bounds on slider change', () => {
  const { container, rerender } = render(<RangeFilterWrapper />);
  const lowerBoundInputElement = container.querySelector('#-lower-bound-input');
  const upperBoundInputElement = container.querySelector('#-upper-bound-input');
  expect(lowerBoundInputElement).not.toHaveValue(30);
  expect(upperBoundInputElement).not.toHaveValue(55);

  rerender(<RangeFilterWrapper values={[30, 55]} />);
  expect(lowerBoundInputElement).toHaveAttribute('max', (55).toString());
  expect(upperBoundInputElement).toHaveAttribute('min', (30).toString());
});

test('calculates fixed length after decimal point correctly', () => {
  const { container } = render(
    <RangeFilter min={min + 0.001} max={max + 0.001} onAfterDrag={() => {}} />
  );

  const minHandleElement = container.querySelector('.rc-slider-handle-1');
  expect(minHandleElement).toHaveAttribute('aria-valuenow', min.toString());

  const maxHandleElement = container.querySelector('.rc-slider-handle-2');
  expect(maxHandleElement).toHaveAttribute('aria-valuenow', max.toString());
});

test('updates inputs on slider change', () => {
  const { container, rerender } = render(<RangeFilterWrapper />);
  const lowerBoundInputElement = container.querySelector('#-lower-bound-input');
  const upperBoundInputElement = container.querySelector('#-upper-bound-input');

  rerender(<RangeFilterWrapper values={[30, 55]} />);
  expect(lowerBoundInputElement).toHaveValue(30);
  expect(upperBoundInputElement).toHaveValue(55);
});

test('updates sliders on input submit', () => {
  const value = 30;
  const { container } = render(<RangeFilterWrapper />);
  const lowerBoundInputElement = container.querySelector('#-lower-bound-input');
  const minHandleElement = container.querySelector('.rc-slider-handle-1');

  fireEvent.change(lowerBoundInputElement, { target: { value } }); // invokes handleLowerBoundInputChange(30)
  fireEvent.blur(lowerBoundInputElement); // invokes handleInputSubmit()
  expect(minHandleElement).toHaveAttribute('aria-valuenow', value.toString());
});

test('clamps lowerBound to between [min, upperBound]', () => {
  const { container, rerender } = render(<RangeFilterWrapper />);
  const lowerBoundInputElement = container.querySelector('#-lower-bound-input');
  const minHandleElement = container.querySelector('.rc-slider-handle-1');

  // lowerBound should be clamped to min
  fireEvent.change(lowerBoundInputElement, { target: { value: min - 1 } });
  fireEvent.blur(lowerBoundInputElement);
  expect(lowerBoundInputElement).toHaveValue(min);
  expect(minHandleElement).toHaveAttribute('aria-valuenow', min.toString());

  // lowerBound should be clamped to upperBound
  const ub = 30;
  rerender(<RangeFilterWrapper values={[min, ub]} />);
  fireEvent.change(lowerBoundInputElement, { target: { value: ub + 1 } });
  fireEvent.blur(lowerBoundInputElement);
  expect(lowerBoundInputElement).toHaveValue(ub);
  expect(minHandleElement).toHaveAttribute('aria-valuenow', ub.toString());
});

test('clamps upperBound to between [lowerBound, max]', () => {
  const { container, rerender } = render(<RangeFilterWrapper />);
  const upperBoundInputElement = container.querySelector('#-upper-bound-input');
  const maxHandleElement = container.querySelector('.rc-slider-handle-2');

  // upperBound should be clamped to max
  fireEvent.change(upperBoundInputElement, { target: { value: max + 1 } });
  fireEvent.blur(upperBoundInputElement);
  expect(upperBoundInputElement).toHaveValue(max);
  expect(maxHandleElement).toHaveAttribute('aria-valuenow', max.toString());

  // upperBound should be clamped to lowerBound
  const lb = 30;
  rerender(<RangeFilterWrapper values={[lb, max]} />);
  fireEvent.change(upperBoundInputElement, { target: { value: lb - 1 } });
  fireEvent.blur(upperBoundInputElement);
  expect(upperBoundInputElement).toHaveValue(lb);
  expect(maxHandleElement).toHaveAttribute('aria-valuenow', lb.toString());
});

test('if count === hideValue, lower slider should not be allowed to increase and upper slider should not be allowed to decrease', () => {
  const lb = 30;
  const ub = 60;
  const { container, rerender } = render(
    <RangeFilterWrapper count={-1} lowerBound={lb} upperBound={ub} />
  );
  const minHandleElement = container.querySelector('.rc-slider-handle-1');
  const maxHandleElement = container.querySelector('.rc-slider-handle-2');

  // increasing lb should have no effect
  rerender(
    <RangeFilterWrapper
      count={-1}
      lowerBound={lb}
      upperBound={ub}
      values={[lb + 1, ub]}
    />
  );
  expect(minHandleElement).toHaveAttribute('aria-valuenow', lb.toString());

  // decreasing ub should have no effect
  rerender(
    <RangeFilterWrapper
      count={-1}
      lowerBound={lb}
      upperBound={ub}
      values={[lb, ub - 1]}
    />
  );
  expect(maxHandleElement).toHaveAttribute('aria-valuenow', ub.toString());

  // lb should still decrease like normal
  rerender(
    <RangeFilterWrapper
      count={-1}
      lowerBound={lb}
      upperBound={ub}
      values={[lb - 1, ub]}
    />
  );
  expect(minHandleElement).toHaveAttribute(
    'aria-valuenow',
    (lb - 1).toString()
  );

  // ub should still increase like normal
  rerender(
    <RangeFilterWrapper
      count={-1}
      lowerBound={lb}
      upperBound={ub}
      values={[lb, ub + 1]}
    />
  );
  expect(maxHandleElement).toHaveAttribute(
    'aria-valuenow',
    (ub + 1).toString()
  );
});

test('if count === hideValue, lower input should not be allowed to increase and upper input should not be allowed to decrease', () => {
  const lb = 30;
  const ub = 60;
  const { container } = render(
    <RangeFilterWrapper count={-1} lowerBound={lb} upperBound={ub} />
  );
  const lowerBoundInputElement = container.querySelector('#-lower-bound-input');
  const upperBoundInputElement = container.querySelector('#-upper-bound-input');
  const minHandleElement = container.querySelector('.rc-slider-handle-1');
  const maxHandleElement = container.querySelector('.rc-slider-handle-2');

  // increasing lb should have no effect
  fireEvent.change(lowerBoundInputElement, { target: { value: lb + 1 } });
  fireEvent.blur(lowerBoundInputElement);
  expect(minHandleElement).toHaveAttribute('aria-valuenow', lb.toString());

  // decreasing ub should have no effect
  fireEvent.change(upperBoundInputElement, { target: { value: ub - 1 } });
  fireEvent.blur(upperBoundInputElement);
  expect(maxHandleElement).toHaveAttribute('aria-valuenow', ub.toString());

  // lb should still decrease like normal
  fireEvent.change(lowerBoundInputElement, { target: { value: lb - 1 } });
  fireEvent.blur(lowerBoundInputElement);
  expect(minHandleElement).toHaveAttribute(
    'aria-valuenow',
    (lb - 1).toString()
  );

  // ub should still increase like normal
  fireEvent.change(upperBoundInputElement, { target: { value: ub + 1 } });
  fireEvent.blur(upperBoundInputElement);
  expect(maxHandleElement).toHaveAttribute(
    'aria-valuenow',
    (ub + 1).toString()
  );
});
