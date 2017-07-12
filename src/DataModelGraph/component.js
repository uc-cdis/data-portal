import React from 'react';
import CreateGraph from './GraphCreator';
import { connect } from 'react-redux';
import { getCounts } from './actions';
import { submissionapi_path } from '../localconf';


function createNodesAndEdges(props) {
  let dictionary = props.dictionary;
  let nodes = [];

  let nodes_to_hide = ["program"];

  Object.keys(dictionary).forEach(function(key,index) {
    if (dictionary[key].type == "object" && !nodes_to_hide.includes(key)) {
      let count = props.counts_search["_".concat(key).concat("_count")];
      if (count != 0) {
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
          }
          else if (exists_in_any_nodes(val["name"], nodes) && exists_in_any_nodes(dictionary[val["name"]].links[i].target_type, nodes)) {
            let edge = {
              source: val["name"],
              target: dictionary[val["name"]].links[i].target_type,
            }
            edges.push(edge);
          }
        }
        if (dictionary[val["name"]].links[i].subgroup) {
          for (let j = 0; j < dictionary[val["name"]].links[i].subgroup.length; j++) {
            if (dictionary[val["name"]].links[i].subgroup[j].target_type) {
              if (nodes_to_hide.includes(dictionary[val["name"]].links[i].subgroup[j].target_type) || nodes_to_hide.includes(val["name"])) {
                continue;
              }
              else if (exists_in_any_nodes(val["name"], nodes) && exists_in_any_nodes(dictionary[val["name"]].links[i].subgroup[j].target_type, nodes)) {
                let edge = {
                  source: val["name"],
                  target: dictionary[val["name"]].links[i].subgroup[j].target_type,
                }
                edges.push(edge);
              }
            }
          }
        }
      }
    }
  });
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
      if (edges[i].target == query) {
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


  return {
    nodes: nodes,
    edges: edges
  };
}

class DataModelGraphComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = createNodesAndEdges(props);
  }
  componentWillReceiveProps(nextProps) {
    this.state = createNodesAndEdges(nextProps);
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

    if (this.state.nodes.length != 0 && 'count' in this.state.nodes[this.state.nodes.length-1]) {
      return (
        <CreateGraph nodes={this.state.nodes} edges={this.state.edges} categories={categories}/>
      );
    } else {
      return null;
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    'dictionary': state.submission.dictionary,
    'counts_search': state.submission.counts_search,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    onGetCounts: (type, project) => dispatch(getCounts(type, project)),
  };
}
const DataModelGraph = connect(mapStateToProps, mapDispatchToProps)(DataModelGraphComponent);
export default DataModelGraph;
