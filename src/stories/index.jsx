import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import IconicButton from '../components/buttons/IconicButton';

storiesOf('IconicButton', module)
  .add('with caption', () => (
    <IconicButton
      onClick={action('clicked')}
      caption="Hello Button"
    />
  ))
  .add('with color', () => (
    <IconicButton
      onClick={action('clicked')}
      iconColor="#000"
    />
  ));
