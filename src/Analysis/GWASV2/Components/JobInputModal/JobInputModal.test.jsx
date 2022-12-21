import React from 'react';
import { shallow, mount } from 'enzyme';
import { Modal, Input } from 'antd';
import JobInputModal from './JobInputModal';
import ValidInitialState from '../../TestData/InitialStates/ValidInitialState';

const open = true;
const setOpen = () => null;
const jobName = 'User Input Job Name 1234';
const handleSubmit = () => {
  setOpen(false);
};
const dispatch = () => null;
const handleEnterJobName = () => null;

const {
  covariates,
  imputationScore,
  mafThreshold,
  numOfPCs,
  selectedHare,
  finalPopulationSizes,
  outcome,
  selectedStudyPopulationCohort,
} = ValidInitialState;

describe('JobInputModal', () => {
  it('should render an AntD modal with an AntD input', () => {
    const wrapper = shallow(
      <JobInputModal
        open={open}
        jobName={jobName}
        handleSubmit={handleSubmit}
        setOpen={setOpen}
        dispatch={dispatch}
        handleEnterJobName={handleEnterJobName}
        numOfPCs={numOfPCs}
        mafThreshold={mafThreshold}
        selectedHare={selectedHare}
        imputationScore={imputationScore}
        selectedCohort={selectedStudyPopulationCohort}
        outcome={outcome}
        finalPopulationSizes={finalPopulationSizes}
        covariates={covariates}
      />,
    );
    const modal = wrapper.find(Modal);
    expect(modal.exists()).toBe(true);
    expect(modal.find(Input).exists()).toBe(true);
  });

  it('should update the value of the AntD input when the user types in the modal', () => {
    const wrapper = mount(
      <JobInputModal
        open={open}
        jobName={jobName}
        handleSubmit={handleSubmit}
        setOpen={setOpen}
        dispatch={dispatch}
        handleEnterJobName={handleEnterJobName}
        numOfPCs={numOfPCs}
        mafThreshold={mafThreshold}
        selectedHare={selectedHare}
        imputationScore={imputationScore}
        selectedCohort={selectedStudyPopulationCohort}
        outcome={outcome}
        finalPopulationSizes={finalPopulationSizes}
        covariates={covariates}
      />,
    );
    const modal = wrapper.find(Modal);
    const input = modal.find(Input);
    input.simulate('change', { target: { value: 'Hello World' } });
    const inputEl = wrapper.find('input').first();
    expect(inputEl.prop('value')).toEqual('Hello World');
  });
});
