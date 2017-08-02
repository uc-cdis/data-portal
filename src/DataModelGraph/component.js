import React from 'react';
import CreateGraph from './GraphCreator';
import { connect } from 'react-redux';
import { getCounts } from './actions';
import { submissionapi_path } from '../localconf';
import { button } from '../theme';
import styled from 'styled-components';
import { createNodesAndEdges } from '../utils'

const ToggleButton = styled.a`
  border: 1px solid darkslategray;
  color: darkslategray;
  ${button};
  position:absolute;
  top:15px;
  left:20px;
  &:hover,
  &:active,
  &:focus {
    color: black;
    border-color: black;
  }
`;


class DataModelGraphComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      compact: undefined,
      full: undefined, 
      full_toggle: false
    }
    this.state.compact = createNodesAndEdges(props, this.state.full_toggle);
    this.handleClick = this.handleClick.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (this.state.full_toggle) {
      this.state.full = createNodesAndEdges(nextProps, this.state.full_toggle);
    } else {
      this.state.compact = createNodesAndEdges(nextProps, this.state.full_toggle);
    }
  } 
  handleClick() {
    if (this.state.full_toggle) {
      this.setState(prevState => ({
        full_toggle: !prevState.full_toggle,
        compact: createNodesAndEdges(this.props,!this.state.full_toggle)
      }));
    } else {
      this.setState(prevState => ({
        full_toggle: !prevState.full_toggle,
        full: createNodesAndEdges(this.props,!this.state.full_toggle)
      }));
    }
  }
  render() {
    if (this.state.full_toggle) {
      if (this.state.full.nodes.length != 0 && 'count' in this.state.full.nodes[this.state.full.nodes.length-1]) {
        return (
          <div style={{position: "relative"}}>
            <ToggleButton onClick={this.handleClick}>Toggle view</ToggleButton>
            <CreateGraph nodes={this.state.full.nodes} edges={this.state.full.edges}/>
          </div>
        );
      } 
    } else {
      if (this.state.compact.nodes.length != 0 && 'count' in this.state.compact.nodes[this.state.compact.nodes.length-1]) {
        return (
          <div style={{position: "relative"}}>
            <ToggleButton onClick={this.handleClick}>Toggle view</ToggleButton>
            <CreateGraph nodes={this.state.compact.nodes} edges={this.state.compact.edges}/>
          </div>
        );
      }
    } 
    return null;
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    'dictionary': state.submission.dictionary,
    'counts_search': state.submission.counts_search,
    'links_search': state.submission.links_search,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    onGetCounts: (type, project) => dispatch(getCounts(type, project)),
  };
}
const DataModelGraph = connect(mapStateToProps, mapDispatchToProps)(DataModelGraphComponent);
export default DataModelGraph;
