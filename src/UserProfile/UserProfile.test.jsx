import React from 'react';
import { mount } from 'enzyme';
import { StaticRouter } from 'react-router-dom';

import UserProfile from './UserProfile';
import { DELETE_BTN } from '../components/tables/KeyTable';

describe('the UserProfile component', () => {
  const testProps = {
    user: {
      project_access: {
        frickjack: ['read', 'write'],
      },
    },
    userProfile: {
      jtis: [
        { jti: 'f8733984-8164-4689-9c25-56707962d7e0', exp: 1459487258 },
        { jti: 'f8733984-8164-4689-9c25-56707962d7e9', exp: 1459487259 },
      ],
    },
    popups: {},
    submission: {
      projects: {
        frickjack: 'program-frickjack',
      },
    },
  };

  const noop = () => {};

  it('lists access keys', () => {
    const $vdom = mount(
      <StaticRouter location={{ pathname: '/identity' }} context={{}}>
        <UserProfile
          {...testProps}
          onCreateKey={noop}
          onClearCreationSession={noop}
          onUpdatePopup={noop}
          onDeleteKey={noop}
          onRequestDeleteKey={noop}
          onClearDeleteSession={noop}
        />
      </StaticRouter>,
    );
    expect($vdom.find('tbody tr')).toHaveLength(testProps.userProfile.jtis.length + 1);
  });

  it('triggers create-key events', (done) => {
    const $vdom = mount(
      <StaticRouter location={{ pathname: '/identity' }} context={{}}>
        <UserProfile
          {...testProps}
          onCreateKey={() => { done(); }}
          onClearCreationSession={noop}
          onUpdatePopup={noop}
          onDeleteKey={noop}
          onRequestDeleteKey={noop}
          onClearDeleteSession={noop}
        />
      </StaticRouter>);
    const $createBtn = $vdom.find('.g3-button');
    expect($createBtn).toHaveLength(1);
    $createBtn.simulate('click');
    // should invoke onCreateKey callback (above - calls done()) ...
  });

  it('triggers delete-key events', (done) => {
    const $vdom = mount(
      <StaticRouter location={{ pathname: '/identity' }} context={{}}>
        <UserProfile
          {...testProps}
          onCreateKey={noop}
          onClearCreationSession={noop}
          onUpdatePopup={noop}
          onDeleteKey={noop}
          onRequestDeleteKey={() => { done(); }}
          onClearDeleteSession={noop}
        />
      </StaticRouter>,
    );
    const $deleteBtn = $vdom.find(`button[name="${DELETE_BTN}"]`);
    expect($deleteBtn).toHaveLength(2);
    $deleteBtn.at(0).simulate('click');
    // should invoke onRequestDeleteKey callback  (above - calls done()) ...
  });
});
