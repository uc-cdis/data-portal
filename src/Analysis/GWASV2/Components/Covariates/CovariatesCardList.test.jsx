import React from 'react';
import { mount } from 'enzyme';
import { DeleteOutlined } from '@ant-design/icons';
import CovariatesCardsList from './CovariatesCardsList';
import ValidState from '../../TestData/States/ValidState';

describe('CovariatesCardsList component', () => {
  let wrapper;
  const mockDeleteCovariate = jest.fn();

  const outcomeText = ValidState.outcome.concept_name;
  const lastCovariateObj = ValidState.covariates.at(-1);
  const lastContinousCovariateText = lastCovariateObj.concept_name;
  const dichotomousObj = ValidState.covariates.filter(
    (obj) => obj.variable_type === 'custom_dichotomous',
  )[0];
  const dichotomousText = dichotomousObj.provided_name;

  beforeEach(() => {
    const mockProps = {
      outcome: ValidState.outcome,
      covariates: ValidState.covariates,
      deleteCovariate: mockDeleteCovariate,
    };
    wrapper = mount(<CovariatesCardsList {...mockProps} />);
  });

  it('should render an outcome card', () => {
    expect(wrapper.find('.outcome-card').exists()).toBe(true);
    expect(wrapper.find('.outcome-card .ant-card-meta-title').text()).toBe(
      'Outcome Phenotype',
    );
    expect(
      wrapper.find('.outcome-card .ant-card-meta-description').text(),
    ).toBe(outcomeText);
  });

  it('should render covariate cards', () => {
    expect(wrapper.find('.dichotomous-card').exists()).toBe(true);
    expect(
      wrapper
        .find('.dichotomous-card .ant-card-meta-title')
        .last()
        .text(),
    ).toBe('Dichotomous Covariate');
    expect(
      wrapper
        .find('.dichotomous-card .ant-card-meta-description')
        .last()
        .text(),
    ).toBe(dichotomousText);

    expect(wrapper.find('.continuous-card').exists()).toBe(true);
    expect(
      wrapper
        .find('.continuous-card .ant-card-meta-title')
        .last()
        .text(),
    ).toBe('Continuous Covariate');
    expect(
      wrapper
        .find('.continuous-card .ant-card-meta-description')
        .last()
        .text(),
    ).toBe(lastContinousCovariateText);
  });

  it('should call deleteCovariate when the delete icon is clicked', () => {
    wrapper
      .find(DeleteOutlined)
      .first()
      .simulate('click');
    expect(mockDeleteCovariate).toHaveBeenCalledWith(dichotomousObj);
    wrapper
      .find(DeleteOutlined)
      .last()
      .simulate('click');
    expect(mockDeleteCovariate).toHaveBeenCalledWith(lastCovariateObj);
  });
});
