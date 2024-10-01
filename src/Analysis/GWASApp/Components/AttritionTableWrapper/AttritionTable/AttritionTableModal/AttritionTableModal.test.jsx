import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AttritionTableModal from './AttritionTableModal';

// Mock the PhenotypeHistogram component
jest.mock(
  '../../../Diagrams/PhenotypeHistogram/PhenotypeHistogram',
  () => () => null,
);

describe('AttritionTableModal', () => {
  const mockSetModalInfo = jest.fn();
  const defaultProps = {
    modalInfo: {
      isModalOpen: true,
      title: 'Test Modal',
      rowObject: { variable_type: 'concept' },
      selectedCohort: {},
      currentCovariateAndCovariatesFromPrecedingRows: [],
      outcome: {},
    },
    setModalInfo: mockSetModalInfo,
  };
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders modal with title and histogram content', () => {
    render(<AttritionTableModal {...defaultProps} />);
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(
      screen.queryByTestId('phenotype-histogram-diagram'),
    ).toBeInTheDocument();
    expect(screen.queryByTestId('euler-diagram')).not.toBeInTheDocument();
  });

  it('displays Euler Diagram when variable_type is custom_dichotomous', () => {
    const customProps = {
      ...defaultProps,
      modalInfo: {
        ...defaultProps.modalInfo,
        rowObject: { variable_type: 'custom_dichotomous' },
      },
    };
    render(<AttritionTableModal {...customProps} />);
    expect(screen.queryByTestId('euler-diagram')).toBeInTheDocument();
    expect(
      screen.queryByTestId('phenotype-histogram-diagram'),
    ).not.toBeInTheDocument();
  });

  it('does not render content if rowObject is not provided', () => {
    const noRowObjectProps = {
      ...defaultProps,
      modalInfo: {
        ...defaultProps.modalInfo,
        rowObject: null,
      },
    };
    render(<AttritionTableModal {...noRowObjectProps} />);
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect( screen.queryByTestId('phenotype-histogram-diagram')).not.toBeInTheDocument();
    expect(screen.queryByTestId('euler-diagram')).not.toBeInTheDocument();
  });
});
