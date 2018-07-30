import 'babel-polyfill';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faAngleUp, faAngleDown } from '@fortawesome/free-solid-svg-icons';

global.fetch = require('jest-fetch-mock');
library.add(faAngleUp, faAngleDown);
Enzyme.configure({ adapter: new Adapter() });
