import React from 'react';
import { Popup } from './component';
import renderer from 'react-test-renderer';


test('Test Popup', () => {
  let onClose = () => {
    console.log('closed');
  }
  let onCancel = () => {
    console.log('canceled');
  }
  let onConfirm = () => {
    console.log('confirmed');
  }
  // react-hightlight doesn't work with jest snapshot, so code and error is not passed
  const component = renderer.create(
    <Popup message='test' onConfirm={onConfirm} onCancel={onCancel} onClose={onClose}/>
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
