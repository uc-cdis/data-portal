import React from 'react';
import { mount } from 'enzyme';
import { Select } from 'antd';
import { QueryClient, QueryClientProvider } from 'react-query';
import SelectHareDropDown from './SelectHareDropDown';
import ValidState from '../../TestData/States/ValidState';
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
  sourceId: 2,
  loading: false,
});

// Other generic arguments and functions shared by tests below:
const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});
const mountDropDownForOutcome = (
  selectedStudyPopulationCohort,
  covariates,
  outcome,
  dispatch,
) => mount(
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

// Tests:
describe('SelectHareDropDown component - Quantitative outcome test scenarios', () => {
  let wrapper;
  const { selectedStudyPopulationCohort, covariates, outcome } = ValidState;
  let dispatch;

  beforeEach(() => {
    dispatch = jest.fn();
    // use mount() instead of shallow():
    wrapper = mountDropDownForOutcome(
      selectedStudyPopulationCohort,
      covariates,
      outcome,
      dispatch,
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
  it('should dispatch an action to update the population size reflecting the selected HARE group', () => {
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

describe('SelectHareDropDown component - Dichotomous (case/control) test scenarios', () => {
  let wrapper;
  const { selectedStudyPopulationCohort, covariates } = ValidState;
  // Custom dichotomous (case/control) outcome type:
  const outcome = {
    variable_type: 'custom_dichotomous',
    provided_name: 'providednamebyuser',
    cohort_ids: [12, 32],
  };
  let dispatch;

  beforeEach(() => {
    dispatch = jest.fn();
    wrapper = mountDropDownForOutcome(
      selectedStudyPopulationCohort,
      covariates,
      outcome,
      dispatch,
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
  it('should dispatch an action to update the population sizes (case, control and total size) reflecting the selected HARE group', () => {
    wrapper
      .find(Select)
      .props()
      .onChange({ value: 'EUR', label: 'non-Hispanic White' });
    expect(dispatch).toHaveBeenCalledWith({
      type: ACTIONS.UPDATE_FINAL_POPULATION_SIZES,
      payload: [
        { population: 'Control', size: 39648 },
        { population: 'Case', size: 39648 },
        { population: 'Total', size: 39648 * 2 },
      ],
    });
  });
});
