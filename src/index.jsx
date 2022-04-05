import { render } from 'react-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faAnchor,
  faAngleUp,
  faAngleDown,
  faCircleCheck,
  faFlask,
  faMicroscope,
  faTriangleExclamation,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import ReactGA from 'react-ga';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import reduxStore from './reduxStore';
import { gaTracking } from './params';
import { basename } from './localconf';
import App from './App';
import '@fontsource/raleway';
import './base.css';
import './icon.css';

// Google Analytics
ReactGA.initialize(gaTracking);
ReactGA.pageview(window.location.pathname + window.location.search);

// FontAwesome icons
library.add(
  faAnchor,
  faAngleUp,
  faAngleDown,
  faCircleCheck,
  faFlask,
  faMicroscope,
  faTriangleExclamation,
  faUser
);

render(
  <Provider store={reduxStore}>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
