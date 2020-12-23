import React from 'react';
import { mount } from 'enzyme';
import Dropdown from '.';

describe('<Dropdown />', () => {
  const func1 = jest.fn();
  const func2 = jest.fn();
  const func3 = jest.fn();
  /* eslint-disable */
  const dropdownWrapper = mount(
    <Dropdown>
      <Dropdown.Button>
        Dropdown
      </Dropdown.Button>
      <Dropdown.Menu>
        <Dropdown.Item onClick={func1}>
          item1
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>,
  );
  const splitDropdownWrapper = mount(
    <Dropdown>
      <Dropdown.Button split onClick={func2}>
        Dropdown
      </Dropdown.Button>
      <Dropdown.Menu>
        <Dropdown.Item onClick={func3}>
          item1
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>,
    /* eslint-enable */
  );

  it('renders', () => {
    expect(dropdownWrapper.find(Dropdown).length).toBe(1);
    expect(dropdownWrapper.state().menuOpen).toEqual(false);
  });

  it('could trigger menu correctly', () => {
    dropdownWrapper.find('.g3-dropdown-button__button').simulate('click');
    expect(dropdownWrapper.state().menuOpen).toBe(true);
    dropdownWrapper.find('.g3-dropdown__item').simulate('click');
    expect(func1.mock.calls.length).toBe(1);

    splitDropdownWrapper.find('.g3-dropdown-button__button').simulate('click');
    expect(splitDropdownWrapper.state().menuOpen).toBe(false);
    expect(func2.mock.calls.length).toBe(1);
    splitDropdownWrapper.find('.g3-dropdown-button__menu-trigger').simulate('click');
    expect(splitDropdownWrapper.state().menuOpen).toBe(true);
    splitDropdownWrapper.find('.g3-dropdown__item').simulate('click');
    expect(func3.mock.calls.length).toBe(1);
  });
});
