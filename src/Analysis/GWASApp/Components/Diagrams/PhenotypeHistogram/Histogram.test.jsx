import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Histogram from './Histogram';

const args = {
  data: [
    {
      start: 0,
      end: 13.499253780913016,
      nr_persons: 1483,
    },
    {
      start: 472.47388233195556,
      end: 485.9731361128686,
      nr_persons: 1331,
    },
    {
      start: 485.9731361128686,
      end: 499.4723898937816,
      nr_persons: 1488,
    },
  ],
  xAxisDataKey: 'key',
  barDataKey: 'value',
};

describe('Histogram component', () => {
  it('renders histogram with default props', () => {
    render(<Histogram {...args} />);
    const histogramComponent = screen.getByTestId('histogram');
    expect(histogramComponent).toBeInTheDocument();
  });

  it('renders three bars when given three datums', () => {
    const { container } = render(<Histogram {...args} />);
    expect(
      container.getElementsByClassName('recharts-bar-rectangle').length,
    ).toBe(3);
  });

  it('renders with a tooltip container', () => {
    const { container } = render(<Histogram {...args} />);
    expect(
      container.getElementsByClassName('recharts-tooltip-wrapper').length,
    ).toBe(1);
  });
});
