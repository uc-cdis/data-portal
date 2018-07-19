import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import SingleSelectFilter from '../components/filters/SingleSelectFilter/.';

storiesOf('Filters', module)
  .add('SingleSelectFilter', () => (
    <SingleSelectFilter label='test1'/>
  ));
