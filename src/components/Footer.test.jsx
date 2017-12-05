import React from 'react';
import { mount } from 'enzyme';
import { StaticRouter } from 'react-router-dom';

import Footer from './Footer';

describe('The Footer component', () => {
  it('Supports static defaults', () => {
    Object.assign(Footer.defaultProps,
      { dictionaryVersion: 'test.test.test', apiVersion: 'api.api.api' },
    );
    const footer = mount(
      <StaticRouter location={{ pathname: '/dd' }}>
        <Footer />
      </StaticRouter>,
    );
    const span = footer.find('span');
    expect(span.length).toBe(2);
    expect(span.at(1).text()).toMatch(/Dictionary vtest.test.test, API vapi.api.api/);
  });
});
