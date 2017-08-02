import React from 'react';
import { submissionapi_path } from './localconf';
import { Box } from './theme';
import Nav from './Nav/component';
import { AuthTimeoutPopup } from './Popup/component';

export const get_submit_path = (project) => {
  let path = project.split('-');
  let program_name = path[0];
  let project_code = path.slice(1).join('-');
  return submissionapi_path + '/' +  program_name + '/' + project_code;
};

export const json_to_string = (data) => {
  let replacer = (key, value) => {
    if (value == null) {
        return undefined;
      }
    return value;
  }
  return JSON.stringify(data, replacer, '  ');
};

export const predict_file_type = (data, file_type) => {
  let predict_type = file_type;
  let json_type = 'application/json';
  let tsv_type = 'text/tab-separated-values';
  data = data.trim();
  if (data.indexOf('{') != -1 || data.indexOf('}') != -1) {
     return json_type;
  }
  if (data.indexOf('\t') != -1) {
    return tsv_type;
  }
  return predict_type;
}

export const withBoxAndNav = (Component) => {
  return ({...props}) => (
    <Box>
      <Nav />
      <Component {...props} />
    </Box>
  )
};

export const withAuthTimeout = (Component) => {
  return ({...props}) => (
    <div>
      <AuthTimeoutPopup />
      <Component {...props} />
    </div>
  )
};

export function createNodesAndEdges(props, create_all, nodes_to_hide=["program"]) {
  let dictionary = props.dictionary;
  let nodes = [];

  Object.keys(dictionary).forEach(function(key,index) {
    if (dictionary[key].type == "object" && !nodes_to_hide.includes(key)) {
      let count = 0
      if (props.counts_search != undefined) {
        count = props.counts_search["_".concat(key).concat("_count")];
      }
      if (create_all || (!create_all && count != 0)) {
        let node = {
          name: key,
          category: dictionary[key].category,
          count: count,
          properties: dictionary[key].properties,
          required: dictionary[key].required,
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
          } else if (props.links_search == undefined || props.links_search[val["name"] + "_to_" + dictionary[val["name"]].links[i].target_type + "_link"] == 0) {
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
              } else if (props.links_search == undefined || props.links_search[val["name"] + "_to_" + dictionary[val["name"]].links[i].subgroup[j].target_type + "_link"] == 0) {
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
