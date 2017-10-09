import React from 'react';
import renderer from 'react-test-renderer';
import Popup from './Popup';


test('Test Popup', () => {
  const onClose = () => {
    console.log('closed');
  };
  const onCancel = () => {
    console.log('canceled');
  };
  const onConfirm = () => {
    console.log('confirmed');
  };
  // react-hightlight doesn't work with jest snapshot, so code and error is not passed
  const component = renderer.create(
    <Popup message="test" onConfirm={onConfirm} onCancel={onCancel} onClose={onClose} />,
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
