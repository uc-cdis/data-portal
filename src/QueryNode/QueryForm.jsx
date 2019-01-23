import React from 'react';
import PropTypes from 'prop-types';
import querystring from 'querystring';
import Select from 'react-select';
import Dropdown from '@gen3/ui-component/dist/components/Dropdown';
import { getSubmitPath } from '../utils';
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

  handleDownloadAll(fileType) {
    window.open(
      `${getSubmitPath(this.props.project)}/export?node_label=${this.state.selectValue.value}&format=${fileType}`,
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
        {
          this.state.selectValue && this.props.queryNodeCount > 0 ? (
            <Dropdown
              className='query-node__download-button'
            >
              <Dropdown.Button>Download All</Dropdown.Button>
              <Dropdown.Menu>
                <Dropdown.Item
                  rightIcon='download'
                  onClick={() => this.handleDownloadAll('tsv')}
                >
                  TSV
                </Dropdown.Item>
                <Dropdown.Item
                  rightIcon='download'
                  onClick={() => this.handleDownloadAll('json')}
                >
                  JSON
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : null
        }
      </form>
    );
  }
}

QueryForm.propTypes = {
  project: PropTypes.string.isRequired,
  nodeTypes: PropTypes.array,
  onSearchFormSubmit: PropTypes.func,
  queryNodeCount: PropTypes.number,
};

QueryForm.defaultProps = {
  nodeTypes: [],
  onSearchFormSubmit: null,
  queryNodeCount: 0,
};

export default QueryForm;
