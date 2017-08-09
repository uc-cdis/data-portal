import React from 'react';
import UserProfile from './component';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import chaiArray from 'chai-arrays';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import { parseKeyToString, createKey } from './actions';
import { RequestButton, Bullet, AccessKeyCell, ActionCell, DeleteButton } from './style';
import { shallowWithStore } from '../setupJest';

chai.use(chaiEnzyme);
chai.use(chaiArray);

const middleware = [ thunk ];
const mockStore = configureMockStore(middleware);


it('User profile creating and listing', () => {
  const expectedCreatedKey = {access_key: 'abc', secret_key: 'xyz' };
  const expectedListKey = {access_keys: [{access_key: 'abc',
    secret_key: 'xyz' }]};
  const state = {user: { project_access: [] }, status: {}, user_profile: {access_key_pairs: []}, popups: {} };
  const store = mockStore(state);
  const expectedReceiveCreatedKeyAction = [
    {
      type: 'CREATE_SUCCEED',
      access_key_pair: expectedCreatedKey,
      str_access_key_pair: parseKeyToString(expectedCreatedKey)
    }
  ];

  fetch.mockResponseOnce(JSON.stringify(expectedCreatedKey), {status: 200});
  fetch.mockResponseOnce(JSON.stringify(expectedListKey), {status: 200});

  const userProfilePage = shallowWithStore(<UserProfile />, store).first().shallow();
  let btn = userProfilePage.find(RequestButton);
  chai.expect(btn).to.have.length(1);
  btn.simulate('click');
  userProfilePage.find(Bullet);
  userProfilePage.find(AccessKeyCell);
  userProfilePage.find(ActionCell);
  userProfilePage.find(DeleteButton);
  chai.expect(btn).to.have.length(1);
});

it('Fetch creating and listing', () => {
  const expectedData = {access_key: 'abc', secret_key: 'xyz' };
  const expectedPopup = {save_key_popup: true};
  const expectedListKey = {access_keys: [{access_key: 'abc',
    secret_key: 'xyz' }]};
  const state = {user: { project_access: [] }, status: {}, user_profile: {access_key_pairs: []}, popups: {} };
  const store = mockStore(state);
  const expectedActions = [
    {
      type: 'CREATE_SUCCEED',
      access_key_pair: expectedData,
      str_access_key_pair: parseKeyToString(expectedData)
    },
    {
      type: 'UPDATE_POPUP',
      data: expectedPopup
    },
    {
      type: 'RECEIVE_USER_PROFILE',
      access_keys: expectedListKey.access_keys
    }
  ];

  fetch.mockResponseOnce(JSON.stringify(expectedData), {status: 200});
  fetch.mockResponseOnce(JSON.stringify(expectedListKey), {status: 200});
  return store.dispatch(createKey("http://anything.com"))
    .then(() => {
      console.log("Store actions: ");
      expect(store.getActions()).toEqual(expectedActions);
    });
});
