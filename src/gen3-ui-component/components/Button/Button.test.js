import React from 'react';
import { mount } from 'enzyme';
import Button from '.';

describe('<Button />', () => {
  const btn = mount(<Button label='test-button' />).find(Button);

  it('renders', () => {
    expect(btn.length).toBe(1);
  });
});
