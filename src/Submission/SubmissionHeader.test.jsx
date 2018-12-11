import React from 'react';
import { mount } from 'enzyme';
import SubmissionHeader from './SubmissionHeader';

describe('SubmissionHeader', () => {
  const user = {
    username: 'testuser@gmail.com',
  };
  const mockFetch = jest.fn();

  it('renders', () => {
    const component = mount(
      <SubmissionHeader user={user} fetchUnmappedFileStats={mockFetch} />,
    );
    expect(component.find(SubmissionHeader).length).toBe(1);
  });
});
