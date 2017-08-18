import React from 'react';
import LoadingSpinner from './component';
import {LoadingSpinnerSVG, LoadingSpinnerWrap} from './style';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import { shallowWithStore } from '../setupJest';

const middleware = [ thunk ];
const mockStore = configureMockStore(middleware);


it('Spinner displaying', () => {
  const state = { };
  const store = mockStore(state);

  const spinner = shallowWithStore(<LoadingSpinner />, store).first().shallow();
  expect(spinner.find(LoadingSpinnerSVG)).toHaveLength(1);
  expect(spinner.find(LoadingSpinnerWrap)).toHaveLength(1);
});
