global.fetch = require('jest-fetch-mock');

import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';

export const shallowWithStore = (component, store) => {
  const context = {
    store,
  };
  return shallow(component, { context });
};

Enzyme.configure({ adapter: new Adapter() });
