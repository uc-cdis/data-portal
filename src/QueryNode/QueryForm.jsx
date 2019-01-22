import React from 'react';
import PropTypes from 'prop-types';
import querystring from 'querystring';
import Select from 'react-select';
import Button from '@gen3/ui-component/dist/components/Button';
import { submissionApiPath } from '../localconf';
import './QueryForm.less';

class QueryForm extends React.Component {
  static propTypes = {
    project: PropTypes.string.isRequired,
  };

  constructor(props) {
    const queryParams = querystring.parse(location.search ? location.search.replace(/^\?+/, '') : '');
    super(props);
    this.state = {
      selectValue: Object.keys(queryParams).length > 0 && queryParams.node_type ?
        { value: queryParams.node_type, label: queryParams.node_type }
        : null,
    };
    this.updateValue = this.updateValue.bind(this);
    this.handleDownloadAll = this.handleDownloadAll.bind(this);
    this.handleQuerySubmit = this.handleQuerySubmit.bind(this);
  }

  handleDownloadAll() {
    const programProject = this.props.project.split('-');
    window.open(
      `${submissionApiPath}${programProject[0]}/${programProject[1]}/export?node_label=${this.state.selectValue.value}&format=tsv`,
      '_blank',
    );
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
        <Button
          onClick={this.handleDownloadAll}
          label='Download All'
          className='query-node__download-button'
        />
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
