import React from 'react';
import { mount } from 'enzyme';
import ArrangerWrapper from './ArrangerWrapper';

describe('ArrangerWrapper', () => {
  it('renders', () => {
    const component = mount(
      <ArrangerWrapper
        api={'localhost'}
        index={''}
        graphqlField={'field'}
        projectId={'id'}
      >
        <div className='test' />
      </ArrangerWrapper>,
    );
    expect(component.find(ArrangerWrapper).length).toBe(1);
  });

  it('uses renderComponent to send props to its children', () => {
    const component = mount(
      <ArrangerWrapper
        api={'localhost'}
        index={''}
        graphqlField={'field'}
        projectId={'id'}
      >
        <div className='test' />
      </ArrangerWrapper>,
    );
    const { children } = component.instance().props;
    const { renderComponent } = component.instance();
    expect(children.props.className).toBe('test');
    const clones = renderComponent({ arg1: 'arg1', arg2: 'arg2' });
    expect(clones.length).toBe(1);
    expect(clones[0].props.className).toBe(children.props.className);
    expect(clones[0].props.arg1).toBe('arg1');
    expect(clones[0].props.arg2).toBe('arg2');
  });
});
