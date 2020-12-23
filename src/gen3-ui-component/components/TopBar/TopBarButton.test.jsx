import React from 'react';
import { mount } from 'enzyme';
import TopBarButton from './TopBarButton';

const internalLink = {
  iconClassName: 'g3-icon g3-icon--upload',
  link: '/submission',
  name: 'Data Submission',
};

const externalLink = {
  link: 'https://uc-cdis.github.io/gen3-user-doc/user-guide/guide-overview',
  name: 'Documentation',
};

const onActiveTab = jest.fn();
const activeClassName = '.top-bar-button--active';

describe('<TopBar />', () => {
  const internalButton = mount(
    <TopBarButton
      item={internalLink}
      onActiveTab={onActiveTab}
      tabIndex={0}
      isActive
    />,
  );

  const externalButton = mount(
    <TopBarButton
      item={externalLink}
      onActiveTab={onActiveTab}
      tabIndex={0}
    />,
  );

  it('renders', () => {
    expect(internalButton.find('TopBarButton').length).toBe(1);
  });

  it('applies the proper class name', () => {
    expect(internalButton.find('TopBarButton').props().isActive).toBe(true);
    expect(internalButton.find(activeClassName).length).toBe(1);

    expect(externalButton.find('TopBarButton').props().isActive).toBe(false);
    expect(externalButton.find(activeClassName).length).toBe(0);
  });
});
