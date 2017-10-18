import React from 'react';
import { mount } from 'enzyme';

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
      <UserProfile
        {...testProps}
        onCreateKey={noop}
        onClearCreationSession={noop}
        onUpdatePopup={noop}
        onDeleteKey={noop}
        onRequestDeleteKey={noop}
        onClearDeleteSession={noop}
      />);
    expect($vdom.find(AccessKeyCell)).toHaveLength(testProps.userProfile.access_key_pairs.length);
  });

  it('triggers create-key events', (done) => {
    const $vdom = mount(
      <UserProfile
        {...testProps}
        onCreateKey={() => { done(); }}
        onClearCreationSession={noop}
        onUpdatePopup={noop}
        onDeleteKey={noop}
        onRequestDeleteKey={noop}
        onClearDeleteSession={noop}
      />);
    const $createBtn = $vdom.find(RequestButton);
    expect($createBtn).toHaveLength(1);
    $createBtn.simulate('click');
    // should invoke onCreateKey callback ...
  });

  it('triggers delete-key events', (done) => {
    const $vdom = mount(
      <UserProfile
        {...testProps}
        onCreateKey={noop}
        onClearCreationSession={noop}
        onUpdatePopup={noop}
        onDeleteKey={noop}
        onRequestDeleteKey={() => { done(); }}
        onClearDeleteSession={noop}
      />);
    const $deleteBtn = $vdom.find(DeleteButton);
    expect($deleteBtn).toHaveLength(2);
    $deleteBtn.at(0).simulate('click');
    // should invoke onRequestDeleteKey callback ...
  });
});
