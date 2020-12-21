import React from 'react';
import { mount } from 'enzyme';
import Toaster from '.';

describe('<Toaster />', () => {
  const t = mount(
    <Toaster isEnabled={false}>
      <div>
          Test
      </div>
    </Toaster>,
  );

  it('updates with state change', () => {
    expect(t.find('.toaster__div').length).toBe(0);
    t.setProps({ isEnabled: true });
    expect(t.find('.toaster__div').length).toBe(1);
    t.setProps({ isEnabled: false });
    expect(t.find('.toaster__div').length).toBe(0);
  });
});
