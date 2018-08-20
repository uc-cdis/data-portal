import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import './QueryForm.less';

class QueryForm extends React.Component {
  static propTypes = {
    project: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      selectValue: null,
    };
    this.updateValue = this.updateValue.bind(this);
    this.handleQuerySubmit = this.handleQuerySubmit.bind(this);
  }

  handleQuerySubmit(event) {
    event.preventDefault();
    const form = event.target;
    const data = { project: this.props.project };
    const queryParam = [];

    for (let i = 0; i < form.length; i += 1) {
      const input = form[i];
      if (input.name && input.value) {
        queryParam.push(`${input.name}=${input.value}`);
        data[input.name] = input.value;
      }
    }
    const url = `/${this.props.project}/search?${queryParam.join('&')}`;
    this.props.onSearchFormSubmit(data, url);
  }


  updateValue(newValue) {
    this.setState({
      selectValue: newValue,
    });
  }

  render() {
    const nodesForQuery = this.props.nodeTypes.filter(nt => !['program', 'project'].includes(nt));
    const options = nodesForQuery.map(nodeType => ({ value: nodeType, label: nodeType }));
    const state = this.state || {};
    return (
      <form onSubmit={this.handleQuerySubmit}>
        <Select className='query-form__select' name='node_type' options={options} value={state.selectValue} onChange={this.updateValue} />
        <input className='query-form__input' placeholder='submitter_id' type='text' name='submitter_id' />
        <input className='query-form__search-button' type='submit' onSubmit={this.handleQuerySubmit} value='search' />
      </form>
    );
  }
}

QueryForm.propTypes = {
  project: PropTypes.string.isRequired,
  nodeTypes: PropTypes.array,
  onSearchFormSubmit: PropTypes.func,
};

QueryForm.defaultProps = {
  nodeTypes: [],
  onSearchFormSubmit: null,
};

export default QueryForm;
