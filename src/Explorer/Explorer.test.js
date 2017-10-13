import React from 'react';
import {RelayExplorerComponent} from './ExplorerComponent';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import { shallowWithStore } from '../setupJest';

const middleware = [thunk];
const mockStore = configureMockStore(middleware);
