import React from 'react';
import { mount } from 'enzyme';
import Header from '.';
import gen3Logo from '../../images/logos/gen3.png';

describe('<Header />', () => {
  const header = mount(
    <Header logoSrc={gen3Logo} title='Header' />,
  ).find(Header);

  it('renders', () => {
    expect(header.length).toBe(1);
  });
});
