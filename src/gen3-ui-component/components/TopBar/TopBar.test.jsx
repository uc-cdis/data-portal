import React from 'react';
import { mount } from 'enzyme';
import { StaticRouter } from 'react-router-dom';
import TopBar from './TopBar';

const tabItems = [
  { iconClassName: 'g3-icon g3-icon--upload', link: '/submission', name: 'Data Submission' },
  { link: 'https://uc-cdis.github.io/gen3-user-doc/user-guide/guide-overview', name: 'Documentation' },
  { iconClassName: 'g3-icon g3-icon--exploration', link: '/explorer', name: 'Explorer' },
];

const user = {
  username: 'test-user',
};

const onActiveTab = jest.fn();
const onLogout = jest.fn();

describe('<TopBar />', () => {
  const component = mount(
    <StaticRouter location={{ pathname: '/' }} context={{}}>
      <TopBar
        tabItems={tabItems}
        user={user}
        onActiveTab={onActiveTab}
        onLogout={onLogout}
      />
    </StaticRouter>,
  );

  it('renders', () => {
    expect(component.find('TopBar').length).toBe(1);
  });

  it('maps external and internal links properly', () => {
    expect(component.find('Link').length).toBe(2);
    expect(component.find('a').length).toBe(tabItems.length);
  });

  it('wont show the user if undefined', () => {
    const noUserComponent = mount(
      <StaticRouter location={{ pathname: '/' }} context={{}}>
        <TopBar
          tabItems={tabItems}
          user={{}}
          onActiveTab={onActiveTab}
          onLogout={onLogout}
        />
      </StaticRouter>,
    );
    expect(noUserComponent.find('button').length).toBe(0);
  });
});
