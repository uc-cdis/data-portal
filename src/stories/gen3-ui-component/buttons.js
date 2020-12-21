import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Button from '../src/components/Button';

class ButtonWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };

    this.mockLoadData = this.mockLoadData.bind(this);
  }

  mockLoadData() {
    console.log('loading...');
    this.setState({ loading: true }, () => {
      setTimeout(() => {
        this.setState({ loading: false });
      }, 5000);
    });
  }

  render() {
    return (
      <Button
        buttonType='primary'
        label='Loading Button'
        onClick={this.mockLoadData}
        leftIcon='download'
        rightIcon='copy'
        isPending={this.state.loading}
      />
    );
  }
}

storiesOf('Buttons', module)
  .add('Primary', () => (
    <Button buttonType='primary' label='Primary Button' onClick={() => action('button click')('primary')} leftIcon='download' rightIcon='copy' />
  ))
  .add('Secondary', () => (
    <Button buttonType='secondary' label='Secondary Button' onClick={() => action('button click')('secondary')} leftIcon='download' rightIcon='copy' />
  ))
  .add('Default', () => (
    <Button buttonType='default' label='Default Button' onClick={() => action('button click')('default')} leftIcon='download' rightIcon='copy' />
  ))
  .add('Disabled', () => (
    <Button buttonType='primary' label='Disabled Button' onClick={() => action('button click')('disabled')} enabled={false} leftIcon='download' rightIcon='copy' />
  ))
  .add('Multiple w/ Tooltip', () => (
    <div style={{ display: 'flex' }}>
      <Button buttonType='primary' label='Tooltip Button 1' onClick={() => action('button click')('tooltip')} leftIcon='download' rightIcon='copy' tooltipEnabled tooltipText='This is a tooltip a user could use to display a message.' />
      <Button buttonType='primary' label='Tooltip Button 2' enabled={false} onClick={() => action('button click')('tooltip')} leftIcon='download' rightIcon='copy' tooltipEnabled tooltipText='This would describe why the button is disabled.' />
      <Button buttonType='primary' label='Tooltip Button 3' onClick={() => action('button click')('tooltip')} leftIcon='download' rightIcon='copy' tooltipEnabled tooltipText='This is a tooltip a user could use to display a message.' />
    </div>
  ))
  .add('Loading state', () => (
    <ButtonWrapper />
  ));
