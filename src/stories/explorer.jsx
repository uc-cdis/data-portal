import React from 'react';
import { storiesOf } from '@storybook/react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import DataExplorer from '../DataExplorer/.';

storiesOf('Data Explorer', module)
  .add('Data Explorer', () => {
    library.add(faAngleDown, faAngleUp);
    return (
      <DataExplorer />
    );
  });
