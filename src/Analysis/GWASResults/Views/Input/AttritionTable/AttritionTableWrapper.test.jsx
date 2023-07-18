import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useQuery } from 'react-query';
import SharedContext from '../../../Utils/SharedContext';
import AttritionTableWrapper from './AttrtitionTableWrapper';
import PHASES from '../../../Utils/PhasesEnumeration';
import attritionTableJSON from '../../../TestData/InputViewData/AttritionTableJSON';

jest.mock('react-query');

describe('Attrition Table Wrapper', () => {
  const selectedRowData = {
    name: 'workflow_name',
    uid: 'workflow_id',
    phase: PHASES.Succeeded,
  };

  it('renders the headers and data when data is fetched successfully', async () => {
    useQuery.mockReturnValueOnce({
      status: 'success',
      data: attritionTableJSON,
    });
    render(
      <SharedContext.Provider value={{ selectedRowData }}>
        <AttritionTableWrapper data={attritionTableJSON} />
      </SharedContext.Provider>,
    );

    const checkForAtLeastOneInstanceOfText = (input) => {
      const textArr = screen.getAllByText(input);
      expect(textArr[0]).toBeInTheDocument();
    };

    await waitFor(() => {
      expect(
        screen.getByText('Case Cohort Attrition Table'),
      ).toBeInTheDocument();
      expect(
        screen.getByText('Control Cohort Attrition Table'),
      ).toBeInTheDocument();
      checkForAtLeastOneInstanceOfText('Type');
      checkForAtLeastOneInstanceOfText('Name');
      checkForAtLeastOneInstanceOfText('Size');
      checkForAtLeastOneInstanceOfText('Non-Hispanic Black');
      checkForAtLeastOneInstanceOfText('Non-Hispanic Asian');
      checkForAtLeastOneInstanceOfText('Non-Hispanic White');
      checkForAtLeastOneInstanceOfText('Hispanic');

      attritionTableJSON.forEach((tableObj) => {
        tableObj.rows.forEach((rowObj) => {
          checkForAtLeastOneInstanceOfText(rowObj.name);
          checkForAtLeastOneInstanceOfText(rowObj.size);
          rowObj.concept_breakdown.forEach((conceptObj) => {
            checkForAtLeastOneInstanceOfText(
              conceptObj.persons_in_cohort_with_value,
            );
          });
        });
      });
    });
  });
});
