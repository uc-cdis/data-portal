import React from 'react';
import { connect } from 'react-redux';
import { getCounts } from './actions';
import { submissionapi_path } from '../localconf';
import { button } from '../theme';
import styled from 'styled-components';
import { createNodesAndEdges } from '../utils'
import { create_dm_graph } from './GraphCreator'
import * as d3 from "d3";

export const ToggleButton = styled.a`
  border: 1px solid darkslategray;
  color: darkslategray;
  ${button};
  position:absolute;
  top:15px;
  left:20px;
  z-index:100;
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

class CreateGraph extends React.Component {
  componentDidMount() {
    create_dm_graph(this.props.nodes, this.props.edges)
  }
  componentDidUpdate() {
    create_dm_graph(this.props.nodes, this.props.edges)
  }
  render() {
    let nodes = this.props.nodes
    let edges = this.props.edges

    let root = "project"
    let queue = [];
    let layout = [];
    let placed = [];
    let layout_level = 0;

    queue.push(root);
    layout.push([root]);
    while(queue.length != 0) {
      let query = queue.shift(); //breadth first
      for (let i = 0; i < edges.length; i++) {
        if (edges[i].target == query || edges[i].target.name == query) {
          if ((layout[layout_level].indexOf(query)) != -1) {
            if (!layout[layout_level+1]) {
              layout[layout_level+1] = [];
            } 
          } else {
            layout_level += 1;
            if (!layout[layout_level+1]) {
              layout[layout_level+1] = [];
            } 
          }
          queue.push(edges[i].source);
          if ((layout[layout_level+1].indexOf(edges[i].source) == -1) && (placed.indexOf(edges[i].source) == -1)) {
            layout[layout_level+1].push(edges[i].source);
            placed.push(edges[i].source);
          }
        }
      }
      placed.push(query);
    }

    for (let i = 0; i < layout.length; i++) {
      for (let j = 0; j < layout[i].length; j++) {
        for (let k = 0; k < nodes.length; k++) {
          if (nodes[k].name == layout[i][j]) {
            nodes[k].position = [(j+1)/(layout[i].length+1),(i+1)/(layout.length+1)];
            break;
          }
        }
      }
    }

    let min_x_pos = Math.round(1/d3.extent(nodes.map((node) => node.position[0]))[0])
    let min_y_pos = Math.round(1/d3.extent(nodes.map((node) => node.position[1]))[0])

    let padding = 25, 
      radius = 60,
      legend_width=125,
      width = min_x_pos * radius * 2 + legend_width, 
      height = min_y_pos * radius * 2 + padding;

    const divStyle = {
      height: height,
      backgroundColor: "#f4f4f4",
      marginLeft: "auto",
      marginRight: "auto",
    }
    return (
      <div style={divStyle}>
        <svg id="data_model_graph" height={height} width={width}>
        </svg>
      </div>
      );
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
