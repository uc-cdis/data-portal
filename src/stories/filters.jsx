import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import SingleSelectFilter from '../components/filters/SingleSelectFilter/.';

storiesOf('Filters', module)
  .add('SingleSelectFilter', () => (
    <div>
      <SingleSelectFilter label='test1' onSelect={action('checked')}/>
      <SingleSelectFilter label='test2' onSelect={action('checked')}/>
    </div>
  ));
