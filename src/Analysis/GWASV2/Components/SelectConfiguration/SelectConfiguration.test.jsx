import React from 'react';
import { shallow } from 'enzyme';
import SelectConfiguration from './SelectConfiguration';
import ValidInitialState from '../../TestData/InitialStates/ValidInitialState';
import ACTIONS from '../../Utils/StateManagement/Actions';

describe('SelectConfiguration component', () => {
  let wrapper;
  const dispatch = jest.fn();
  const {
    numOfPCs,
    mafThreshold,
    selectedStudyPopulationCohort,
    covariates,
    outcome,
    imputationScore,
  } = ValidInitialState;

  beforeEach(() => {
    wrapper = shallow(
      <SelectConfiguration
        numOfPCs={numOfPCs}
        mafThreshold={mafThreshold}
        selectedCohort={selectedStudyPopulationCohort}
        covariates={covariates}
        outcome={outcome}
        dispatch={dispatch}
        imputationScore={imputationScore}
      />,
    );
  });
  it('should render the InputNumber component for the number of PCs', () => {
    expect(wrapper.find('#input-numOfPCs').exists()).toBe(true);
  });
  it('should render the InputNumber component for the MAF threshold', () => {
    expect(wrapper.find('#input-maf').exists()).toBe(true);
  });
  it('should render the SelectHareDropDown component', () => {
    expect(wrapper.find('#input-selectHareDropDown').exists()).toBe(true);
  });
  it('should render the InputNumber component for the imputation score', () => {
    expect(wrapper.find('#input-imputation').exists()).toBe(true);
  });
  it('should dispatch an action to update the number of PCs when the InputNumber value changes', () => {
    wrapper
      .find('#input-numOfPCs')
      .props()
      .onChange(3);
    expect(dispatch).toHaveBeenCalledWith({
      type: ACTIONS.UPDATE_NUM_PCS,
      payload: 3,
    });
  });
  it('should dispatch an action to update the MAF threshold when the InputNumber value changes', () => {
    wrapper
      .find('#input-maf')
      .props()
      .onChange(0.2);
    expect(dispatch).toHaveBeenCalledWith({
      type: ACTIONS.UPDATE_MAF_THRESHOLD,
      payload: 0.2,
    });
  });

  it('should dispatch an action to update the MAF threshold when the InputNumber value changes', () => {
    wrapper
      .find('#input-maf')
      .props()
      .onChange(0.2);
    expect(dispatch).toHaveBeenCalledWith({
      type: ACTIONS.UPDATE_MAF_THRESHOLD,
      payload: 0.2,
    });
  });

  it('should dispatch an action to update the imputation score when the InputNumber value changes', () => {
    wrapper
      .find('#input-imputation')
      .props()
      .onChange(0.7);
    expect(dispatch).toHaveBeenCalledWith({
      type: ACTIONS.UPDATE_IMPUTATION_SCORE,
      payload: 0.7,
    });
  });
});
