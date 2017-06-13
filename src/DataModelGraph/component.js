import React from 'react';
import Create_graph from './GraphCreator';
import { connect } from 'react-redux';
import { fetchWrapper } from '../actions';
import { submissionapi_path } from '../localconf';

export const getCounts = (type, project) => {
  var query = "{";
  function append_to_query(element) {
    if (element != "metaschema") {
      query = query.concat("_" + element + "_count (project_id: \"" + project + "\"),");
    }
  }
  type.forEach((element) => {
    if (element != "program") {
      append_to_query(element);
    }
  });
  query = query.concat("}");
  return fetchWrapper({
    path: submissionapi_path + 'graphql',
    body: JSON.stringify({
      'query': query 
    }),
    method: 'POST',
    handler: receiveCounts
  });
}

var receiveCounts = ({status, data}) => {
  switch (status){
    case 200:
      return {
        type: 'RECEIVE_COUNTS',
        data: data.data
      };
    default:
      return {
        type: 'FETCH_ERROR',
        error: data.data
      }
  }
};

function createNodesAndEdges(props) {
  var dictionary = props.dictionary;
  var nodes = [];

  Object.keys(dictionary).forEach(function(key,index) {
    if (dictionary[key].type == "object" && key != "program") {
      var count = props.counts_search["_".concat(key).concat("_count")];
      if (count != 0) {
        var node = {
          name: key,
          category: dictionary[key].category,
          count: count,
        }
        nodes.push(node);
      }
    }
  });

  function check_in_nodes(value, nodes) {
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i]["name"] == value) {
        return 1; 
      }
    }
    return 0;
  }

  var edges= [];
  nodes.forEach(function(val,index) {
    if (!val["name"].startsWith("_") && dictionary[val["name"]].links) {
      for (var i = 0; i < dictionary[val["name"]].links.length; i++) {
        if (dictionary[val["name"]].links[i].target_type) {
          if (dictionary[val["name"]].links[i].target_type == "program" || val["name"] == "program") {
            continue;
          }
          else if (check_in_nodes(val["name"], nodes)) {
            var edge = {
              source: val["name"],
              target: dictionary[val["name"]].links[i].target_type,
            }
            edges.push(edge);
          }
        }
        if (dictionary[val["name"]].links[i].subgroup) {
          for (var j = 0; j < dictionary[val["name"]].links[i].subgroup.length; j++) {
            if (dictionary[val["name"]].links[i].subgroup[j].target_type) {
              if (dictionary[val["name"]].links[i].subgroup[j].target_type == "program" || val["name"] == "program") {
                continue;
              }
              else if (check_in_nodes(val["name"], nodes)) {
                var edge = {
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
  var root = "project"
  var queue = [];
  var layout = [];
  var placed = [];
  var layout_level = 0;
  queue.push(root);
  layout.push([root]);
  while(queue.length != 0) {
    var query = queue.shift(); //breadth first
    for (var i = 0; i < edges.length; i++) {
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

  for (var i = 0; i < layout.length; i++) {
    for (var j = 0; j < layout[i].length; j++) {
      for (var k = 0; k < nodes.length; k++) {
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
    if ('count' in this.state.nodes[this.state.nodes.length-1]) {
      return (
        <Create_graph nodes={this.state.nodes} edges={this.state.edges} node_types={this.props.node_types} project={this.props.project}/>
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
    'node_types': state.submission.node_types,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    onGetCounts: (type, project) => dispatch(getCounts(type, project)),
  };
}
const DataModelGraph = connect(mapStateToProps, mapDispatchToProps)(DataModelGraphComponent);
export default DataModelGraph;
