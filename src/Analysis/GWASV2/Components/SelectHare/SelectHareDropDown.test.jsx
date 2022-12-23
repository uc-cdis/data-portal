import React from 'react';
import { mount } from 'enzyme';
import { Select } from 'antd';
import { QueryClient, QueryClientProvider } from 'react-query';
import SelectHareDropDown from './SelectHareDropDown';
import ValidInitialState from '../../TestData/InitialStates/ValidInitialState';
import ACTIONS from '../../Utils/StateManagement/Actions';
import { SourceContextProvider } from '../../Utils/Source';
import {
  fetchConceptStatsByHareSubset,
  useSourceFetch,
} from '../../Utils/cohortMiddlewareApi';

// Mock relevant API calls:
jest.mock('../../Utils/cohortMiddlewareApi');
fetchConceptStatsByHareSubset.mockResolvedValue({
  concept_breakdown: [
    {
      concept_value: 'ASN',
      concept_value_as_concept_id: 2000007029,
      concept_value_name: 'non-Hispanic Asian',
      persons_in_cohort_with_value: 40178,
    },
    {
      concept_value: 'EUR',
      concept_value_as_concept_id: 2000007031,
      concept_value_name: 'non-Hispanic White',
      persons_in_cohort_with_value: 39648,
    },
  ],
});
useSourceFetch.mockResolvedValue({
  sourceId: 2, loading: false,
});

describe('SelectHareDropDown component', () => {
  let wrapper;
  const dispatch = jest.fn();
  const {
    selectedStudyPopulationCohort,
    covariates,
    outcome,
  } = ValidInitialState;

  const mockedQueryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  beforeEach(() => {
    // use mount() instead of shallow():
    wrapper = mount(
      <QueryClientProvider client={mockedQueryClient}>
        <SourceContextProvider>
          <SelectHareDropDown
            id='input-selectHareDropDownTest'
            selectedCohort={selectedStudyPopulationCohort}
            covariates={covariates}
            outcome={outcome}
            dispatch={dispatch}
          />
        </SourceContextProvider>
      </QueryClientProvider>,
    );
  });
  it('should render the SelectHareDropDown component', async () => {
    expect(wrapper.find(SelectHareDropDown).exists()).toBe(true);
    expect(wrapper.find(SelectHareDropDown)).toHaveLength(1);
  });
  it('should dispatch an action to update the selected HARE object', () => {
    wrapper
      .find(Select)
      .props()
      .onChange({ value: 'EUR', label: 'non-Hispanic White' });
    expect(dispatch).toHaveBeenCalledWith({
      type: ACTIONS.UPDATE_SELECTED_HARE,
      payload: {
        concept_value: 'EUR',
        concept_value_as_concept_id: 2000007031,
        concept_value_name: 'non-Hispanic White',
      },
    });
  });
  it('should dispatch an action to update the population sizes reflecting the selected HARE group', () => {
    wrapper
      .find(Select)
      .props()
      .onChange({ value: 'EUR', label: 'non-Hispanic White' });
    expect(dispatch).toHaveBeenCalledWith({
      type: ACTIONS.UPDATE_FINAL_POPULATION_SIZES,
      payload: [{ population: 'Total', size: 39648 }],
    });
  });
});
// TODO: add dichotomous (case/control) scenarios...
