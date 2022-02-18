import { useState } from 'react';
import { storiesOf } from '@storybook/react';
import Toaster from '../../../src/gen3-ui-component/components/Toaster';
import Button from '../../../src/gen3-ui-component/components/Button';

storiesOf('Toaster', module).add('Basic', () => {
  const [show, setShow] = useState(false);
  return (
    <div>
      <Button
        buttonType='primary'
        label='Show Toaster'
        onClick={() => setShow(true)}
      />
      <Button
        buttonType='primary'
        label='Close Toaster'
        onClick={() => setShow(false)}
      />
      <Toaster isEnabled={show}>
        <Button
          buttonType='secondary'
          label='Close'
          onClick={() => setShow(false)}
        />
      </Toaster>
    </div>
  );
});
