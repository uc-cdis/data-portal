import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Select } from 'antd';

const { Option } = Select;

class EnumInput extends Component {
  componentDidMount() {
    if (this.props.onUpdateFormSchema !== undefined) {
      this.props.onUpdateFormSchema({ [this.props.name]: this.props.propertyType });
    }
  }

  render() {
    const options = this.props.options.map((option) => ({ label: option, value: option }));

    const onChangeEnumWrapper = (newValue) => {
      this.props.onChange(this.props.name, newValue);
    };
    return (
      <div>
        <Form.Item
          label={this.props.name}
          name={this.props.name}
          help={(this.props.description !== '') ? this.props.description : undefined}
          rules={[
            {
              required: this.props.required,
            },
          ]}
        >
          <Select onChange={onChangeEnumWrapper} size={'large'} allowClear>
            {options.map((opt) => (
              <Option key={opt.value} value={opt.value}>{opt.label}</Option>
            ))}
          </Select>
        </Form.Item>
      </div>
    );
  }
}

EnumInput.propTypes = {
  name: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  required: PropTypes.bool.isRequired,
  description: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onUpdateFormSchema: PropTypes.func,
  propertyType: PropTypes.string,
};

EnumInput.getDefaultProps = {
  onUpdateFormSchema: () => {},
  propertyType: null,
};

export default EnumInput;
