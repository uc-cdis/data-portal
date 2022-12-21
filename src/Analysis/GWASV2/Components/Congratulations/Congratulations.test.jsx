import React from 'react';
import { shallow } from 'enzyme';
import ACTIONS from '../../Utils/StateManagement/Actions';
import Congratulations from './Congratulations';
import DismissibleMessage from '../DismissibleMessage/DismissibleMessage';

describe('Congratulations component', () => {
  let wrapper;
  const mockSetShowSuccess = jest.fn();
  const mockDispatch = jest.fn();
  const successText = 'Your submission was successful';
  const jobName = 'Test Job Name';

  beforeEach(() => {
    wrapper = shallow(
      <Congratulations
        dispatch={mockDispatch}
        setShowSuccess={mockSetShowSuccess}
        successText={successText}
        jobName={jobName}
      />
    );
  });

  // this is necessary to check in JEST that the window.location.reload has occurred
  const original = window.location;
  beforeAll(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { reload: jest.fn() },
    });
  });
  afterAll(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: original,
    });
  });

  it('renders a DismissibleMessage component', () => {
    expect(wrapper.find(DismissibleMessage)).toHaveLength(1);
  });

  it('renders 3 buttons', () => {
    expect(wrapper.find('button')).toHaveLength(3);
  });

  it('calls the window.location function when the second button is clicked', () => {
    wrapper
      .find('button')
      .at(1)
      .simulate('click');
    expect(window.location.reload).toHaveBeenCalled();
  });

  it('calls the dispatch function with the correct action when the third button is clicked', () => {
    wrapper
      .find('button')
      .at(2)
      .simulate('click');
    expect(mockDispatch).toHaveBeenCalledWith({
      type: ACTIONS.SET_CURRENT_STEP,
      payload: 3,
    });
  });
});
