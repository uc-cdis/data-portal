import React from 'react';
import { mount } from 'enzyme';
import { DeleteOutlined } from '@ant-design/icons';
import CovariatesCardsList from './CovariatesCardsList';
import ValidInitialState from '../../TestData/InitialStates/ValidInitialState';

describe('CovariatesCardsList component', () => {
  let wrapper;
  const mockDeleteCovariate = jest.fn();

  beforeEach(() => {
    const mockProps = {
      outcome: ValidInitialState.outcome,
      covariates: [
        { provided_name: 'test dichotomous covariate', concept_id: 123 },
        { concept_name: 'test continuous covariate', concept_id: 456 },
      ],
      deleteCovariate: mockDeleteCovariate,
    };
    wrapper = mount(<CovariatesCardsList {...mockProps} />);
  });

  it('should render an outcome card', () => {
    expect(wrapper.find('.outcome-card').exists()).toBe(true);
    expect(wrapper.find('.outcome-card .ant-card-meta-title').text()).toBe(
      'Outcome',
    );
    expect(
      wrapper.find('.outcome-card .ant-card-meta-description').text(),
    ).toBe('Attribute8');
  });

  it('should render two covariate cards', () => {
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
    ).toBe('test dichotomous covariate');

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
    ).toBe('test continuous covariate');
  });

  it('should call deleteCovariate when the delete icon is clicked', () => {
    wrapper
      .find(DeleteOutlined)
      .first()
      .simulate('click');
    expect(mockDeleteCovariate).toHaveBeenCalledWith({
      provided_name: 'test dichotomous covariate',
      concept_id: 123,
    });
    wrapper
      .find(DeleteOutlined)
      .last()
      .simulate('click');
    expect(mockDeleteCovariate).toHaveBeenCalledWith({
      concept_name: 'test continuous covariate',
      concept_id: 456,
    });
  });
});
