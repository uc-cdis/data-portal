import React from 'react';
import { screen, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Simple3SetsEulerDiagram from './Simple3SetsEulerDiagram';

describe('<Simple3SetsEulerDiagram />', () => {
  it('renders the component', () => {
    render(
      <Simple3SetsEulerDiagram
        set1Size={100}
        set2Size={200}
        set3Size={300}
        set12Size={50}
        set13Size={60}
        set23Size={70}
        set123Size={10}
      />
    );
    expect(screen.getByTestId('euler-diagram')).toBeInTheDocument();
  });

  it('throws an error if invalid set sizes are passed', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => {
      render(
        <Simple3SetsEulerDiagram
          set1Size={100}
          set2Size={200}
          set3Size={300}
          set12Size={250}
          set13Size={60}
          set23Size={70}
          set123Size={10}
        />
      );
    }).toThrowError(
      'Error: invalid set sizes. A set overlap cannot be bigger than the set itself.'
    );
  });
});
