import React from 'react';
import { mount } from 'enzyme';
import { DeleteOutlined } from '@ant-design/icons';
import { Card } from 'antd';
import CovariatesCardsList from './CovariatesCardsList';

describe('CovariatesCardsList component', () => {
  let wrapper;
  let mockDeleteCovariate;

  beforeEach(() => {
    mockDeleteCovariate = jest.fn();

    const mockProps = {
      outcome: { provided_name: 'test outcome' },
      covariates: [
        { provided_name: 'test dichotomous covariate', concept_id: null },
        { concept_name: 'test continuous covariate', concept_id: '123' },
      ],
      deleteCovariate: mockDeleteCovariate,
    };

    wrapper = mount(<CovariatesCardsList {...mockProps} />);
    console.log(wrapper.debug());
  });

  it('should render an outcome card', () => {
    expect(wrapper.find('.outcome-card').exists()).toBe(true);
    expect(wrapper.find('.outcome-card .ant-card-meta-title').text()).toBe(
      'Outcome'
    );
    expect(
      wrapper.find('.outcome-card .ant-card-meta-description').text()
    ).toBe('test outcome');
  });

  it('should render two covariate cards', () => {
    expect(wrapper.find('.dichotomous-card').exists()).toBe(true);
    expect(wrapper.find('.dichotomous-card .ant-card-meta-title').text()).toBe(
      'Dichotomous Covariate'
    );
    expect(
      wrapper.find('.dichotomous-card .ant-card-meta-description').text()
    ).toBe('test dichotomous covariate');

    expect(wrapper.find('.continuous-card').exists()).toBe(true);
    expect(wrapper.find('.continuous-card .ant-card-meta-title').text()).toBe(
      'Continuous Covariate'
    );
    expect(
      wrapper.find('.continuous-card .ant-card-meta-description').text()
    ).toBe('test continuous covariate');
  });

  it('should call deleteCovariate when the delete icon is clicked', () => {
    wrapper
      .find(DeleteOutlined)
      .first()
      .simulate('click');
    expect(mockDeleteCovariate).toHaveBeenCalledWith({
      provided_name: 'test dichotomous covariate',
      concept_id: null,
    });

    wrapper
      .find(DeleteOutlined)
      .last()
      .simulate('click');
    expect(mockDeleteCovariate).toHaveBeenCalledWith({
      concept_name: 'test continuous covariate',
      concept_id: '123',
    });
  });
});
