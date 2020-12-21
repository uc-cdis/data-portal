import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Dropdown from '../src/components/Dropdown';

storiesOf('Dropdown', module)
  .add('Split Button', () => (
    <Dropdown buttonType='primary' className='my-dropdown'>
      <Dropdown.Button split onClick={action('item0 clicked')}>
          Split Dropdown
      </Dropdown.Button>
      <Dropdown.Menu>
        <Dropdown.Item onClick={action('item1 clicked')} leftIcon='datafile' rightIcon='download'>item1</Dropdown.Item>
        <Dropdown.Item onClick={action('item2 clicked')} leftIcon='planet' rightIcon='download'>item2</Dropdown.Item>
        <Dropdown.Item onClick={action('item3 clicked')} leftIcon='clinical' rightIcon='download'>item3</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  ))
  .add('Single Dropdown', () => (
    <Dropdown buttonType='secondary' className='my-dropdown'>
      <Dropdown.Button onClick={action('item0 clicked')}>
          Dropdown
      </Dropdown.Button>
      <Dropdown.Menu>
        <Dropdown.Item onClick={action('exportToWorkspace clicked')} leftIcon='datafile'>Export to Workspace</Dropdown.Item>
        <Dropdown.Item onClick={action('exportToAnalyzerApp clicked')} leftIcon='upload'>Export to Analyzer App</Dropdown.Item>
        <Dropdown.Item onClick={action('exportToTSV clicked')} leftIcon='clinical' disabled>Export to TSV (Disabled)</Dropdown.Item>
        <Dropdown.MenuDivider />
        <Dropdown.Item onClick={action('exportPFBToWorkspace clicked')} leftIcon='workspace'>Export PFB to Workspace</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  ))
  .add('Disabled', () => (
    <Dropdown disabled buttonType='primary' className='my-dropdown'>
      <Dropdown.Button onClick={action('item0 clicked')}>
          Disabled
      </Dropdown.Button>
      <Dropdown.Menu>
        <Dropdown.Item onClick={action('item1 clicked')} leftIcon='datafile'>item1</Dropdown.Item>
        <Dropdown.Item onClick={action('item2 clicked')} leftIcon='upload'>item2</Dropdown.Item>
        <Dropdown.Item onClick={action('item3 clicked')} leftIcon='clinical'>item3</Dropdown.Item>
        <Dropdown.MenuDivider />
        <Dropdown.Item onClick={action('item4 clicked')} leftIcon='workspace'>item4</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )).add('Custom Icon Dropdown', () => (
    <Dropdown buttonType='secondary' className='my-dropdown'>
      <Dropdown.Button onClick={action('item0 clicked')} rightIcon='files'>
          Dropdown
      </Dropdown.Button>
      <Dropdown.Menu>
        <Dropdown.Item onClick={action('item1 clicked')} leftIcon='datafile'>item1</Dropdown.Item>
        <Dropdown.Item onClick={action('item2 clicked')} leftIcon='upload'>item2</Dropdown.Item>
        <Dropdown.Item onClick={action('item3 clicked')} leftIcon='clinical' disabled>Disabled item</Dropdown.Item>
        <Dropdown.MenuDivider />
        <Dropdown.Item onClick={action('item4 clicked')} leftIcon='workspace'>item4</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  ));
