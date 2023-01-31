import React from 'react';
import { render, screen, getAllByType, logRoles } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Histogram from './Histogram';

/*
  Code to aid in Jest Mocking, see:
  https://stackoverflow.com/questions/39830580/jest-test-fails-typeerror-window-matchmedia-is-not-a-function
*/
window.matchMedia =
  window.matchMedia ||
  function() {
    return {
      matches: false,
      addListener() {},
      removeListener() {},
    };
  };

/*
let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});
*/
describe('Histogram component', () => {
  it('renders histogram with default props', () => {
    render(<Histogram data={[]} xAxisDataKey='key' barDataKey='value' />);
    const histogramComponent = screen.getByTestId('histogram');
    expect(histogramComponent).toBeInTheDocument();
  });

  it('renders two bars when given two datums', () => {
    const { container } = render(
      <Histogram
        data={[
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
        ]}
        xAxisDataKey='key'
        barDataKey='value'
      />
    );

    expect(
      container.getElementsByClassName('recharts-bar-rectangle').length
    ).toBe(3);
  });

  it('renders with a tooltip container', () => {
    const data = [];
    const xAxisDataKey = 'otherValue';
    const barDataKey = 'value';
    const chartWidth = 600;
    const chartHeight = 350;
    const barColor = 'hotpink';
    const { container } = render(
      <Histogram
        data={data}
        xAxisDataKey={xAxisDataKey}
        barDataKey={barDataKey}
        chartWidth={chartWidth}
        chartHeight={chartHeight}
        barColor={barColor}
      />
    );
    expect(
      container.getElementsByClassName('recharts-tooltip-wrapper').length
    ).toBe(1);
  });
});
