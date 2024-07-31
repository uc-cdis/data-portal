import React from 'react';
import { mount } from 'enzyme';
import { Modal, Input } from 'antd';
import { QueryClient, QueryClientProvider } from 'react-query/';
import JobInputModal from './JobInputModal';
import ACTIONS from '../../Utils/StateManagement/Actions';
import ValidState from '../../TestData/States/ValidState';

const open = true;
const setOpen = () => null;
const jobName = 'User Input Job Name 1234';
const handleEnterJobName = () => null;
const mockHandleSubmit = jest.fn();
const mockDispatch = jest.fn();

const {
  covariates,
  imputationScore,
  mafThreshold,
  numOfPCs,
  selectedHare,
  finalPopulationSizes,
  outcome,
  selectedStudyPopulationCohort,
} = ValidState;

jest.mock(
  '../../../SharedUtils/WorkflowLimitsDashboard/WorkflowLimitsUtils',
  () => ({
    fetchMonthlyWorkflowLimitInfo: jest.fn(),
    workflowLimitInfoIsValid: () => true,
  }),
);

describe('JobInputModal outputs correct values', () => {
  const queryClient = new QueryClient();
  const wrapper = mount(
    <QueryClientProvider client={queryClient}>
      <JobInputModal
        open={open}
        jobName={jobName}
        handleSubmit={mockHandleSubmit}
        setOpen={setOpen}
        dispatch={mockDispatch}
        handleEnterJobName={handleEnterJobName}
        numOfPCs={numOfPCs}
        mafThreshold={mafThreshold}
        selectedHare={selectedHare}
        imputationScore={imputationScore}
        selectedCohort={selectedStudyPopulationCohort}
        outcome={outcome}
        finalPopulationSizes={finalPopulationSizes}
        covariates={covariates}
      />
    </QueryClientProvider>,
  );

  it('should render an AntD modal with an AntD input', () => {
    const modal = wrapper.find(Modal);
    expect(modal.exists()).toBe(true);
    expect(modal.find(Input).exists()).toBe(true);
  });
  it('should display correct number of numOfPCS', () => {
    const numOfPCsContainer = wrapper.find('#modal-num-of-pcs');
    expect(numOfPCsContainer.text()).toMatch(String(numOfPCs));
  });
  it('should display correct number for mafThreshold', () => {
    const mafThresholdContainer = wrapper.find('#modal-maf-threshold');
    expect(mafThresholdContainer.text()).toMatch(String(mafThreshold));
  });
  it('should display correct hare ancestry string', () => {
    const hareAncestryContainer = wrapper.find('#modal-hare-ancestry');
    expect(hareAncestryContainer.text()).toMatch(
      selectedHare.concept_value_name,
    );
  });
  it('should display correct imputation score', () => {
    const imputationScoreContainer = wrapper.find('#modal-imputation-score');
    expect(imputationScoreContainer.text()).toMatch(String(imputationScore));
  });
  it('should display correct cohort', () => {
    const cohortContainer = wrapper.find('#modal-cohort');
    expect(cohortContainer.text()).toMatch(
      selectedStudyPopulationCohort.cohort_name,
    );
  });
  it('should display correct outcome', () => {
    const outcomeContainer = wrapper.find('#modal-outcome');
    expect(outcomeContainer.text()).toMatch(
      outcome?.concept_name ?? outcome?.provided_name,
    );
  });
  it('should display each population size', () => {
    const populationContainer = wrapper.find('#modal-population-size');
    finalPopulationSizes.forEach((item) => {
      expect(populationContainer.text()).toContain(item.size);
    });
  });
  it('should display each covariate', () => {
    const covariateContainer = wrapper.find('#modal-covariates');
    covariates.forEach((covariate) => {
      expect(covariateContainer.text()).toContain(
        covariate?.concept_name ?? covariate.provided_name,
      );
    });
  });
  it('calls the dispatch function with the correct action when the back button is clicked', () => {
    const backButton = wrapper.findWhere(
      (node) => node.type() && node.name() && node.text() === 'Back',
    );
    backButton.last().simulate('click');
    expect(mockDispatch).toHaveBeenCalledWith({
      type: ACTIONS.SET_CURRENT_STEP,
      payload: 3,
    });
  });
  it('calls the handle submit function with no parameters when the submit button is clicked', () => {
    const backButton = wrapper.findWhere(
      (node) => node.type() && node.name() && node.text() === 'Submit',
    );
    backButton.last().simulate('click');
    expect(mockHandleSubmit).toHaveBeenCalledWith();
  });
});
