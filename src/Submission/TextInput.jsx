import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input } from 'antd';
import './TextInput.less';

class TextInput extends Component {
  componentDidMount() {
    if (this.props.onUpdateFormSchema !== undefined) {
      this.props.onUpdateFormSchema({ [this.props.name]: this.props.propertyType });
    }
  }

  render() {
    return (
      <div>
        <Form.Item
          className='text-input__form-item'
          id={this.props.id}
          label={this.props.name}
          name={this.props.name}
          help={(this.props.description !== '') ? this.props.description : undefined}
          rules={[
            {
              required: this.props.required,
            },
          ]}
        >
          <Input onChange={this.props.onChange} name={this.props.name} value={this.props.value || ''} />
        </Form.Item>
      </div>
    );
  }
}

TextInput.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  required: PropTypes.bool.isRequired,
  description: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onUpdateFormSchema: PropTypes.func,
  propertyType: PropTypes.string,
};

TextInput.getDefaultProps = {
  onUpdateFormSchema: () => {},
  propertyType: undefined,
  value: undefined,
};

export default TextInput;
