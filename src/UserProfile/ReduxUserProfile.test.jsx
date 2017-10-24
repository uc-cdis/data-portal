import React from 'react';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import { mount } from 'enzyme';

import ReduxUserProfile, { parseKeyToString, createKey } from './ReduxUserProfile';
import { RequestButton } from './UserProfile';

const middleware = [thunk];
const mockStore = configureMockStore(middleware);


describe('the userProfile component', () => {
  it('can create, fetch, and list user access keys', () => {
    const expectedData = { access_key: 'abc', secret_key: 'xyz' };
    const expectedPopup = { save_key_popup: true };
    const expectedListKey = {
      access_keys: [{
        access_key: 'abc',
        secret_key: 'xyz',
      }],
    };
    const state = {
      user: { project_access: [] },
      status: {},
      userProfile: { access_key_pairs: [] },
      popups: {},
    };
    const store = mockStore(state);

    fetch.mockResponseOnce(JSON.stringify(expectedData), { status: 200 });
    fetch.mockResponseOnce(JSON.stringify(expectedListKey), { status: 200 });

    const userProfilePage = mount(<ReduxUserProfile />, { context: { store } });
    const btn = userProfilePage.find(RequestButton);
    expect(btn).toHaveLength(1);
    btn.simulate('click');
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Note that mock-store does not register reducers, so UI does not update,
        // but can check for expected actions
        const expectedActions = [
          {
            type: 'CREATE_SUCCEED',
            access_key_pair: expectedData,
            str_access_key_pair: parseKeyToString(expectedData),
          },
          {
            type: 'UPDATE_POPUP',
            data: expectedPopup,
          },
          {
            type: 'RECEIVE_USER_PROFILE',
            access_keys: expectedListKey.access_keys,
          },
        ];
        try {
          expect(store.getActions()).toEqual(expectedActions);
          resolve('ok');
        } catch (ex) { reject(ex); }
      }, 100);
    });
  });

  it('updates the redux store', () => {
    const expectedData = { access_key: 'abc', secret_key: 'xyz' };
    const expectedPopup = { save_key_popup: true };
    const expectedListKey = {
      access_keys: [{
        access_key: 'abc',
        secret_key: 'xyz',
      }],
    };
    const state = {
      user: { project_access: [] },
      status: {},
      userProfile: { access_key_pairs: [] },
      popups: {},
    };
    const store = mockStore(state);
    const expectedActions = [
      {
        type: 'CREATE_SUCCEED',
        access_key_pair: expectedData,
        str_access_key_pair: parseKeyToString(expectedData),
      },
      {
        type: 'UPDATE_POPUP',
        data: expectedPopup,
      },
      {
        type: 'RECEIVE_USER_PROFILE',
        access_keys: expectedListKey.access_keys,
      },
    ];

    fetch.mockResponseOnce(JSON.stringify(expectedData), { status: 200 });
    fetch.mockResponseOnce(JSON.stringify(expectedListKey), { status: 200 });
    return store.dispatch(createKey('http://anything.com'))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });
});
