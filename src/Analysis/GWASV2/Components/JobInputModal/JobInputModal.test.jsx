import React, { useState } from 'react';
import { shallow, mount } from 'enzyme';
import JobInputModal from './JobInputModal';
import { Modal, Input } from 'antd';

const open = true;
const setOpen = () => null;
const jobName = 'User Input Job Name 1234';
const handleSubmit = () => {
  setOpen(false);
};
const dispatch = () => null;
const handleEnterJobName = () => null;
const covariates = [
  {
    variable_type: 'concept',
    concept_id: 2000000873,
    concept_name: 'Attribute81',
  },
  {
    variable_type: 'concept',
    concept_id: 2000000873,
    concept_name: 'Attribute82',
  },
  {
    variable_type: 'concept',
    concept_id: 2000000873,
    concept_name: 'Attribute83',
  },
];
const selectedCohort = {
  variable_type: 'concept',
  concept_id: 2000000873,
  concept_name: 'Attribute83',
};
const imputationScore = 0.3;
const mafThreshold = 0.01;
const numOfPCs = 3;
const selectedHare = {
  concept_value: '',
};
const finalPopulationSizes = [
  { population: 'Control', size: 90 },
  { population: 'Case', size: 95 },
  { population: 'Total', size: 90 + 95 },
];
const outcome = {
  variable_type: 'concept',
  concept_id: 2000000873,
  concept_name: 'Attribute83',
};

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
        selectedCohort={selectedCohort}
        outcome={outcome}
        finalPopulationSizes={finalPopulationSizes}
        covariates={covariates}
      />
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
        selectedCohort={selectedCohort}
        outcome={outcome}
        finalPopulationSizes={finalPopulationSizes}
        covariates={covariates}
      />
    );
    const modal = wrapper.find(Modal);
    //modal.simulate('ok'); // open the modal
    const input = modal.find(Input);
    input.simulate('change', { target: { value: 'Hello World' } });
    //console.log(wrapper.debug());
    // const inputEl = input.find('input');
    // console.log(inputEl.prop('value'));
    // expect(inputEl.prop('value')).toEqual('Hello World');
    const inputEl = wrapper.find('input');
    expect(inputEl.prop('value')).toEqual('Hello World');
  });
});
