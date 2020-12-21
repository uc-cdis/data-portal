import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Toaster from '../src/components/Toaster';
import Button from '../src/components/Button';

class ToasterWrapper extends React.Component {
    
    constructor(props) {
      super(props);
      this.state = {
        toasterEnabled: false,
      };
    }

    enableToaster = () => {
      this.setState({toasterEnabled: true});
    }

    disableToaster = () => {
      this.setState({toasterEnabled: false});
    }

    render() {
      return (
        <div>
          <Button
            buttonType='primary'
            label='Show Toaster'
            onClick={this.enableToaster}
          />
          <Button
            buttonType='primary'
            label='Close Toaster'
            onClick={this.disableToaster}
          />
          <Toaster isEnabled={this.state.toasterEnabled}>
            <Button
              buttonType='secondary'
              label='Close'
              onClick={this.disableToaster}
            />
          </Toaster>
        </div>
      )
    }
}

storiesOf('Toaster', module)
    .add('Basic', () =>  (
        <ToasterWrapper/> ));