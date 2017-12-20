import React from 'react';
import { mount } from 'enzyme';
import { StaticRouter } from 'react-router-dom';

import UserProfile, { AccessKeyCell, DeleteButton, RequestButton } from './UserProfile';

describe('the UserProfile component', () => {
  const testProps = {
    user: {
      project_access: {
        frickjack: ['read', 'write'],
      },
    },
    userProfile: {
      access_key_pairs: [
        { access_key: 'frickjack1' },
        { access_key: 'frickjack2' },
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
      <StaticRouter location={{ pathname: '/identity' }}>
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
    expect($vdom.find(AccessKeyCell)).toHaveLength(testProps.userProfile.access_key_pairs.length);
  });

  it('triggers create-key events', (done) => {
    const $vdom = mount(
      <StaticRouter location={{ pathname: '/identity' }}>
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
    const $createBtn = $vdom.find(RequestButton);
    expect($createBtn).toHaveLength(1);
    $createBtn.simulate('click');
    // should invoke onCreateKey callback (above - calls done()) ...
  });

  it('triggers delete-key events', (done) => {
    const $vdom = mount(
      <StaticRouter location={{ pathname: '/identity' }}>
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
    const $deleteBtn = $vdom.find(DeleteButton);
    expect($deleteBtn).toHaveLength(2);
    $deleteBtn.at(0).simulate('click');
    // should invoke onRequestDeleteKey callback  (above - calls done()) ...
  });
});
