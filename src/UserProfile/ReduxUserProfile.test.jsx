import React from 'react';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import { mount } from 'enzyme';

import ReduxUserProfile, { createKey, deleteKey } from './ReduxUserProfile';

const middleware = [thunk];
const mockStore = configureMockStore(middleware);


describe('the userProfile component', () => {
  it('can create, fetch, and list user access keys', () => {
    const expectedData = {
      key_id: 'f8733984-8164-4689-9c25-56707962d7e0',
      api_key: {
        sub: '1234567',
        iss: 'dcfauth:56fc3842ccf2c1c7ec5c5d14',
        iat: 1459458458,
        exp: 1459487258,
        jti: 'f8733984-8164-4689-9c25-56707962d7e0',
        aud: [
          'refresh',
        ],
        azp: 'nIBmveVwqw0GNImXkIUwYD4uBg1Rnc98QlWLMm06',
        access_aud: [
          'user',
        ],
        context: {
          user: {
            name: 'NIH_USERNAME',
            projects: {
              phs000178: ['member'],
              phs000218: ['member', 'submitter'],
            },
            email: 'user@university.edu',
          },
        },
      },
    };
    const expectedPopup = { saveTokenPopup: true };
    const expectedListKey = {
      jtis: [
        { jti: 'f8733984-8164-4689-9c25-56707962d7e0', exp: 1459487258 },
      ],
    };
    const state = {
      user: { project_access: [] },
      status: {},
      userProfile: { jtis: [] },
      popups: {},
    };
    const store = mockStore(state);

    fetch.mockResponseOnce(JSON.stringify(expectedData), { status: 200 });
    fetch.mockResponseOnce(JSON.stringify(expectedListKey), { status: 200 });

    const userProfilePage = mount(<ReduxUserProfile />, { context: { store } });
    const btn = userProfilePage.find('.g3-button');
    expect(btn).toHaveLength(1);
    btn.simulate('click');
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Note that mock-store does not register reducers, so UI does not update,
        // but can check for expected actions
        const expectedActions = [
          {
            type: 'CREATE_SUCCEED',
            refreshCred: expectedData,
            strRefreshCred: JSON.stringify(expectedData, null, '\t'),
          },
          {
            type: 'UPDATE_POPUP',
            data: expectedPopup,
          },
          {
            type: 'RECEIVE_USER_PROFILE',
            jtis: expectedListKey.jtis,
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
    const expectedData = {
      key_id: 'f8733984-8164-4689-9c25-56707962d7e0',
      api_key: {
        sub: '1234567',
        iss: 'dcfauth:56fc3842ccf2c1c7ec5c5d14',
        iat: 1459458458,
        exp: 1459487258,
        jti: 'f8733984-8164-4689-9c25-56707962d7e0',
        aud: [
          'refresh',
        ],
        azp: 'nIBmveVwqw0GNImXkIUwYD4uBg1Rnc98QlWLMm06',
        access_aud: [
          'user',
        ],
        context: {
          user: {
            name: 'NIH_USERNAME',
            projects: {
              phs000178: ['member'],
              phs000218: ['member', 'submitter'],
            },
            email: 'user@university.edu',
          },
        },
      },
    };
    const expectedPopup = { saveTokenPopup: true };
    const expectedListKey = {
      jtis: [
        { jti: 'f8733984-8164-4689-9c25-56707962d7e0', exp: 1459487258 },
      ],
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
        refreshCred: expectedData,
        strRefreshCred: JSON.stringify(expectedData, null, '\t'),
      },
      {
        type: 'UPDATE_POPUP',
        data: expectedPopup,
      },
      {
        type: 'RECEIVE_USER_PROFILE',
        jtis: expectedListKey.jtis,
      },
    ];

    fetch.mockResponseOnce(JSON.stringify(expectedData), { status: 200 });
    fetch.mockResponseOnce(JSON.stringify(expectedListKey), { status: 200 });
    return store.dispatch(createKey('http://anything.com'))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });


  it('can can delete key', () => {
    const jti = 'f8733984-8164-4689-9c25-56707962d7e0';
    const exp = 1459487258;
    const body = { exp: 1459487258 };
    const keypairsApi = 'test.com/action=delete';

    const state = {
      user: { project_access: [] },
      status: {},
      userProfile: { jtis: [] },
      popups: {},
    };

    const store = mockStore(state);

    const expectedPopup = { deleteTokenPopup: false };
    const expectedActions = [
      {
        type: 'DELETE_KEY_SUCCEED',
      },
      {
        type: 'CLEAR_DELETE_KEY_SESSION',
      },
      {
        data: expectedPopup,
        type: 'UPDATE_POPUP',
      },
      {
        type: 'RECEIVE_USER_PROFILE',
        jtis: [],
      },
    ];

    fetch.mockResponseOnce(JSON.stringify(body), { status: 204 });
    fetch.mockResponseOnce(JSON.stringify({ jtis: [] }), { status: 200 });


    return store.dispatch(deleteKey(jti, exp, keypairsApi))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });
});
