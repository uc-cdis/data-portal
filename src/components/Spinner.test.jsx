import React from 'react';
import Spinner from './Spinner';
import { mount } from 'enzyme';


it('Spinner displaying', () => {
  const spinner = mount(<Spinner />);
  expect(spinner.find('svg').length).toBe(1);
  expect(spinner.find('div').length).toBe(2);
});
