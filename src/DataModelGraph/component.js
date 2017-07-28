import React from 'react';
import CreateGraph from './GraphCreator';
import { connect } from 'react-redux';
import { getCounts } from './actions';
import { submissionapi_path } from '../localconf';
import { button } from '../theme';
import styled from 'styled-components';

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

function createNodesAndEdges(props, create_all) {
  let dictionary = props.dictionary;
  let nodes = [];

  let nodes_to_hide = ["program"];

  Object.keys(dictionary).forEach(function(key,index) {
    if (dictionary[key].type == "object" && !nodes_to_hide.includes(key)) {
      let count = props.counts_search["_".concat(key).concat("_count")];
      if (create_all || (!create_all && count != 0)) {
        let node = {
          name: key,
          category: dictionary[key].category,
          count: count,
        }
        nodes.push(node);
      } 
    }
  });

  function exists_in_any_nodes(value, nodes) {
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i]["name"] == value) {
        return 1; 
      }
    }
    return 0;
  }

  let edges= [];
  nodes.forEach(function(val,index) {
    if (!val["name"].startsWith("_") && dictionary[val["name"]].links) {
      for (let i = 0; i < dictionary[val["name"]].links.length; i++) {
        if (dictionary[val["name"]].links[i].target_type) {
          if (nodes_to_hide.includes(dictionary[val["name"]].links[i].target_type) || nodes_to_hide.includes(val["name"])) {
            continue;
          } else if (props.links_search[val["name"] + "_to_" + dictionary[val["name"]].links[i].target_type + "_link"] == 0) {
            if (create_all) {
              let edge = {
                source: val["name"],
                target: dictionary[val["name"]].links[i].target_type,
                exists: 0
              }
              edges.push(edge);
            }
            continue;
          }
          else if (exists_in_any_nodes(val["name"], nodes) && exists_in_any_nodes(dictionary[val["name"]].links[i].target_type, nodes)) {
            let edge = {
              source: val["name"],
              target: dictionary[val["name"]].links[i].target_type,
            }
            if (create_all) {
              edge.exists = 1
            }
            edges.push(edge);
          }
        }
        if (dictionary[val["name"]].links[i].subgroup) {
          for (let j = 0; j < dictionary[val["name"]].links[i].subgroup.length; j++) {
            if (dictionary[val["name"]].links[i].subgroup[j].target_type) {
              if (nodes_to_hide.includes(dictionary[val["name"]].links[i].subgroup[j].target_type) || nodes_to_hide.includes(val["name"])) {
                continue;
              } else if (props.links_search[val["name"] + "_to_" + dictionary[val["name"]].links[i].subgroup[j].target_type + "_link"] == 0) {
                if (create_all) {
                  let edge = {
                    source: val["name"],
                    target: dictionary[val["name"]].links[i].subgroup[j].target_type,
                    exists: 0
                  }
                  edges.push(edge);
                }
                continue;
              }
              else if (exists_in_any_nodes(val["name"], nodes) && exists_in_any_nodes(dictionary[val["name"]].links[i].subgroup[j].target_type, nodes)) {
                let edge = {
                  source: val["name"],
                  target: dictionary[val["name"]].links[i].subgroup[j].target_type,
                }
                if (create_all) {
                  edge.exists = 1
                }
                edges.push(edge);
              }
            }
          }
        }
      }
    }
  });

  return {
    nodes: nodes,
    edges: edges
  };
}

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
    let categories = Object.keys(this.props.dictionary).map((key) => {return this.props.dictionary[key];})
      .reduce((acc, elem) => {
        if (acc.indexOf(elem.category) === -1 && elem.category != undefined) {
          acc.push(elem.category);
        }
      return acc;
    }, []);
    categories.sort(function(a, b) {
      a = a.toLowerCase();
      b = b.toLowerCase();
      if (a < b) {
        return -1;
      } else if (a > b) {
        return 1;
      } else {
        return 0;
      }
    })

    if (this.state.full_toggle) {
      if (this.state.full.nodes.length != 0 && 'count' in this.state.full.nodes[this.state.full.nodes.length-1]) {
        return (
          <div style={{position: "relative"}}>
            <ToggleButton onClick={this.handleClick}>Toggle view</ToggleButton>
            <CreateGraph nodes={this.state.full.nodes} edges={this.state.full.edges} categories={categories}/>
          </div>
        );
      } 
    } else {
      if (this.state.compact.nodes.length != 0 && 'count' in this.state.compact.nodes[this.state.compact.nodes.length-1]) {
        return (
          <div style={{position: "relative"}}>
            <ToggleButton onClick={this.handleClick}>Toggle view</ToggleButton>
            <CreateGraph nodes={this.state.compact.nodes} edges={this.state.compact.edges} categories={categories}/>
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
