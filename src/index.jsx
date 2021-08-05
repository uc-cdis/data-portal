import React from 'react';
import { render } from 'react-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faAnchor,
  faAngleUp,
  faAngleDown,
  faCheckCircle,
  faExclamationTriangle,
  faFlask,
  faMicroscope,
  faUser,
  faFolderOpen,
  faSave,
  faPen,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import ReactGA from 'react-ga';
import getReduxStore from './reduxStore';
import { gaTracking } from './params';
import App from './App';
import sessionMonitor from './SessionMonitor';
import '@fontsource/raleway';
import './gen3-ui-component/css/base.css';
import './gen3-ui-component/css/icon.css';

// monitor user's session
sessionMonitor.start();

// Google Analytics
ReactGA.initialize(gaTracking);
ReactGA.pageview(window.location.pathname + window.location.search);

// FontAwesome icons
library.add(
  faAnchor,
  faAngleUp,
  faAngleDown,
  faCheckCircle,
  faExclamationTriangle,
  faFlask,
  faMicroscope,
  faUser,
  faFolderOpen,
  faSave,
  faPen,
  faTrashAlt
);

// render the app after the store is configured
async function init() {
  const store = await getReduxStore();
  render(<App store={store} />, document.getElementById('root'));
}

init();
