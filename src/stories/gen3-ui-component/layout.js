import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { StaticRouter } from 'react-router-dom';
import TopBar from '../src/components/TopBar/TopBar';
import Header from '../src/components/Header/.';
import Footer from '../src/components/Footer/.';
import gen3Logo from '../src/images/logos/gen3.png';

const tabItems = [
  { iconClassName: 'g3-icon g3-icon--upload', link: '/submission', name: 'Data Submission' },
  { link: 'https://uc-cdis.github.io/gen3-user-doc/user-guide/guide-overview', name: 'Documentation' },
];

const user = {
  username: 'test-user',
};

storiesOf('Layout', module)
  .add('TopBar', () => (
    <StaticRouter location={{ pathname: '/' }} context={{}}>
      <TopBar
        tabItems={tabItems}
        user={user}
        onActiveTab={action('link clicked')}
        onLogout={() => action('link clicked')('logout')}
      />
    </StaticRouter>
  ))
  .add('Header', () => (
    <Header logoSrc={gen3Logo} title='Demo Framework' />
  ))
  .add('Footer', () => (
    <Footer logoSrc={gen3Logo} />
  ));
