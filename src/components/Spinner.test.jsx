import React from 'react';
import { mount } from 'enzyme';

import Spinner from './Spinner';

it('Spinner displaying', () => {
  const spinner = mount(<Spinner />);
  expect(spinner.find('svg').length).toBe(1);
  expect(spinner.find('div').length).toBe(1);
});
