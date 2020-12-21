import React from 'react';
import { mount } from 'enzyme';
import CommonsLogin from '.';
import kfLogo from '../../images/logos/kf-logo.png';

describe('<CommonsLogin />', () => {
  const commonsLogin = mount(
    <CommonsLogin title='KidsFirst' logoSrc={kfLogo} buttonTitle='Connect' onButtonClick={() => {}} />,
  ).find(CommonsLogin);

  it('renders', () => {
    expect(commonsLogin.length).toBe(1);
  });
});
