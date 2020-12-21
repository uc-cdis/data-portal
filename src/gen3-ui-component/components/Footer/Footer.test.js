import React from 'react';
import { mount } from 'enzyme';
import Footer from '.';
import gen3Logo from '../../images/logos/gen3.png';

describe('<Footer />', () => {
  const header = mount(
    <Footer logoSrc={gen3Logo} />,
  ).find(Footer);

  it('renders', () => {
    expect(header.length).toBe(1);
  });
});
