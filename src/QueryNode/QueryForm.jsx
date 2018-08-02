import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Select from 'react-select';

const SearchButton = styled.input`
  transition: 0.25s;
  color: white;
  margin-bottom: 1em;
  background-color: ${props => props.theme.color_secondary};
  border: 1px solid ${props => props.theme.color_secondary};
  line-height: 34px;
  &:hover,
  &:active,
  &:focus {
    background-color: ${props => props.theme.color_secondary_fade};
    border: 1px solid ${props => props.theme.color_secondary_fade};

  }
  padding: 0em 0.5em;
`;

const Dropdown = styled(Select)`
  width: 40%;
  float: left;
  margin-right: 1em;
`;

const Input = styled.input`
  transition: 0.25s;
  border: 1px solid #c1c1c1;
  line-height: 34px;
  margin-right: 1em;
  padding: 0em 0.5em;
  border-radius: 5px;
`;

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
        <Dropdown name="node_type" options={options} value={state.selectValue} onChange={this.updateValue} />
        <Input placeholder="submitter_id" type="text" name="submitter_id" />
        <SearchButton type="submit" onSubmit={this.handleQuerySubmit} value="search" />
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
