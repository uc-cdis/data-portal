import { render } from 'react-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faAnchor,
  faAngleUp,
  faAngleDown,
  faCircleCheck,
  faCircleInfo,
  faCircleUser,
  faFlask,
  faMicroscope,
  faTriangleExclamation,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from './redux/store';
import { basename } from './localconf';
import App from './App';
import '@fontsource/raleway';
import './base.css';
import './icon.css';

// FontAwesome icons
library.add(
  faAnchor,
  faAngleUp,
  faAngleDown,
  faCircleCheck,
  faCircleInfo,
  faCircleUser,
  faFlask,
  faMicroscope,
  faTriangleExclamation,
  faUser
);

render(
  <Provider store={store}>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
