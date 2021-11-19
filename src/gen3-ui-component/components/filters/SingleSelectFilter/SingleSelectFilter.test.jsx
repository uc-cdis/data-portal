import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import SingleSelectFilter from './index';

test('renders', () => {
  const { container } = render(
    <SingleSelectFilter label='test1' onSelect={() => {}} hideZero={false} />
  );
  expect(container.firstElementChild).toHaveClass('g3-single-select-filter');
});

test('calls onSelect when selected', () => {
  const onSelect = jest.fn();
  const { container } = render(
    <SingleSelectFilter label='test1' onSelect={onSelect} hideZero={false} />
  );
  fireEvent.click(container.querySelector('input'));
  expect(onSelect).toHaveBeenCalled();
});
