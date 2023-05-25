import React from 'react';
import { render, screen } from '@testing-library/react';
import SharedContext from '../../Utils/SharedContext';
import DetailPageHeader from './DetailPageHeader';
import '@testing-library/jest-dom';

const setCurrentView = (input) => {
  alert(`setCurrentView called with ${input}`);
};
describe('DetailPageHeader', () => {
  test('renders page title and a return button', () => {
    const pageTitle = 'Execution Details';
    render(
      <SharedContext.Provider value={{ setCurrentView }}>
        <DetailPageHeader pageTitle={pageTitle} />
      </SharedContext.Provider>,
    );
    const titleElement = screen.getByText(pageTitle);
    expect(titleElement).toBeInTheDocument();
    const returnButton = screen.getByRole('button');
    expect(returnButton).toBeInTheDocument();
  });
});
