import React from 'react';
import { storiesOf } from '@storybook/react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import DataExplorer from '../DataExplorer/.';
import GuppyDataExplorer from '../GuppyDataExplorer/.';

storiesOf('Data Explorer', module)
  .add('Data Explorer', () => {
    library.add(faAngleDown, faAngleUp);
    return (
      <DataExplorer />
    );
  })
  .add('Guppy Data Explorer', () => {

    const chartConfig = {
      'project': {
        'chartType': 'count',
        'title': 'Projects'
      },
      'study': {
        'chartType': 'count',
        'title': 'Studies'
      },
      'file_type': {
        'chartType': 'count',
        'title': 'File Types'
      },
      'ethnicity': {
        'chartType': 'stackedBar',
        'title': 'Ethnicity'
      },
      'gender': {
        'chartType': 'pie',
        'title': 'Gender'
      },
      'race': {
        'chartType': 'pie',
        'title': 'Race'
      },
      'vital_status': {
        'chartType': 'bar',
        'title': 'Vital Status'
      }
    };

    const filterConfig = {
      tabs: [{
        title: 'Project',
        filters: [
          { field: 'project', label: 'Project' },
          { field: 'study', label: 'Study' },
        ],
      },
      {
        title: 'Subject',
        filters: [
          { field: 'race', label: 'Race' },
          { field: 'ethnicity', label: 'Ethnicity' },
          { field: 'gender', label: 'Gender' },
          { field: 'vital_status', label: 'Vital_status' },
        ],
      },
      {
        title: 'File',
        filters: [
          { field: 'file_count', label: 'File_count' },
          { field: 'file_type', label: 'File_type' },
          { field: 'file_format', label: 'File_format' },
        ],
      }],
    };

    return (
      <GuppyDataExplorer
        chartConfig={chartConfig}
        filterConfig={filterConfig}
        guppyServerPath='http://localhost:3000/graphql'
      />
    );
  });
