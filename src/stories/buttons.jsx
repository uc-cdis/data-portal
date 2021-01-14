import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Route, StaticRouter } from 'react-router-dom';

import IconicButton from '../components/buttons/IconicButton';
import IconicLink from '../components/buttons/IconicLink';

storiesOf('IconicButton', module)
  .add('with caption', () => (
    <IconicButton onClick={action('clicked')} caption='Hello Button' />
  ))
  .add('with color', () => (
    <IconicButton
      onClick={action('clicked')}
      iconColor='var(--gen3-color__highlight-orange)'
      caption="When you click me, I'm orange!"
    />
  ));

const context = {};

storiesOf('IconicLink', module)
  .add('with caption', () => (
    <StaticRouter context={context}>
      <Route>
        <IconicLink
          onClick={action('clicked')}
          link='test.com'
          iconColor='var(--gen3-color__highlight-orange)'
          caption='Hello Link'
        />
      </Route>
    </StaticRouter>
  ))
  .add('with color', () => (
    <StaticRouter context={context}>
      <Route>
        <IconicLink
          onClick={action('clicked')}
          link='test.com'
          caption="When you click me, I'm orange!"
        />
      </Route>
    </StaticRouter>
  ));
