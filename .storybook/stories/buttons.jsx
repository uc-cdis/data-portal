import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { MemoryRouter } from 'react-router-dom';

import IconicButton from '../../src/components/buttons/IconicButton';
import IconicLink from '../../src/components/buttons/IconicLink';

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

storiesOf('IconicLink', module)
  .add('with caption', () => (
    <MemoryRouter>
      <IconicLink
        onClick={action('clicked')}
        link='test.com'
        iconColor='var(--gen3-color__highlight-orange)'
        caption='Hello Link'
      />
    </MemoryRouter>
  ))
  .add('with color', () => (
    <MemoryRouter>
      <IconicLink
        onClick={action('clicked')}
        link='test.com'
        caption="When you click me, I'm orange!"
      />
    </MemoryRouter>
  ));
