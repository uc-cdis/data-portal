import React from 'react';
import { mount } from 'enzyme';
import { StaticRouter } from 'react-router-dom';
import SubmissionHeader from './SubmissionHeader';
import getReduxStore from '../reduxStore';

describe('SubmissionHeader', () => {
  const user = {
    username: 'testuser@gmail.com',
  };
  const mockFetch = jest.fn();

  it('renders', () => {
    const component = mount(
      <SubmissionHeader user={user} fetchUnmappedFileStats={mockFetch}/>
    );
    expect(component.find(SubmissionHeader).length).toBe(1);
  });
});
