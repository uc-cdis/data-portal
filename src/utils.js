import React from 'react';
import * as d3 from 'd3';

import { submissionApiPath } from './localconf';
import { Box, Body, Margin } from './theme';
import Nav from './Nav/component';
import Footer from './components/Footer';
import { AuthTimeoutPopup } from './Popup/component';

export const getSubmitPath = (project) => {
  const path = project.split('-');
  const program_name = path[0];
  const project_code = path.slice(1).join('-');
  return `${submissionApiPath}/${program_name}/${project_code}`;
};

export const jsonToString = (data) => {
  const replacer = (key, value) => {
    if (value === null) {
      return undefined;
    }
    return value;
  };
  return JSON.stringify(data, replacer, '  ');
};

export const predictFileType = (data, file_type) => {
  const predict_type = file_type;
  const json_type = 'application/json';
  const tsv_type = 'text/tab-separated-values';
  data = data.trim();
  if (data.indexOf('{') !== -1 || data.indexOf('}') !== -1) {
    return json_type;
  }
  if (data.indexOf('\t') !== -1) {
    return tsv_type;
  }
  return predict_type;
};

export const withBoxAndNav = Component => ({ ...props }) => (
  <div>
    <Box>
      <Nav />
      <Body>
        <Component {...props} />
      </Body>
      <Margin />
    </Box>
    <Footer />
  </div>
);

export const withAuthTimeout = Component => ({ ...props }) => (
  <div>
    <AuthTimeoutPopup />
    <Component {...props} />
  </div>
);

/**
 * Little wrapper around setinterval with a guard to prevent an async function
 * from being invoked multiple times.
 * 
 * @param {()=>Promise} lambda callback should return a Promise
 * @param {int} timeoutMs passed through to setinterval
 * @return the setinterval id (can be passed to clearinterval)
 */
export function asyncSetInterval(lambda, timeoutMs) {
  let isRunningGuard = false;
  return setInterval(
    () => {
      if (!isRunningGuard) {
        isRunningGuard = true;

        lambda().then(
          () => { isRunningGuard = false; },
        );
      }
    }, timeoutMs,
  );
}

/**
 * createNodesAndEdges: Given a data dictionary that defines a set of nodes
 *    and edges, returns the nodes and edges in correct format
 *
 * props: Object (normally taken from redux state) that includes dictionary 
 *    property defining the dictionary as well as other optional properties 
 *    such as counts_search and links_search (created by getCounts)
 * create_all: Include all nodes and edges or only those that are populated in
 *    counts_search and links_search
 * nodes_to_hide: Array of nodes to hide from graph
 *
 * Returns: Object containing nodes and edges
 */
export function createNodesAndEdges(props, create_all, nodes_to_hide = ['program']) {
  const dictionary = props.dictionary;
  const nodes = [];

  Object.keys(dictionary).forEach((key, index) => {
    if (dictionary[key].type === 'object' && !nodes_to_hide.includes(key)) {
      let count = 0;
      if (props.counts_search != undefined) {
        count = props.counts_search['_'.concat(key).concat('_count')];
      }
      if (create_all || (!create_all && count !== 0)) {
        const node = {
          name: key,
          category: dictionary[key].category,
          count,
          properties: dictionary[key].properties,
          required: dictionary[key].required,
        };
        nodes.push(node);
      }
    }
  });

  const edges = [];
  nodes.forEach((val, index) => {
    if (!val.name.startsWith('_') && dictionary[val.name].links) {
      for (let i = 0; i < dictionary[val.name].links.length; i++) {
        if (dictionary[val.name].links[i].target_type) {
          if (nodes_to_hide.includes(dictionary[val.name].links[i].target_type) || nodes_to_hide.includes(val.name)) {
            continue;
          } else if (props.links_search == undefined || props.links_search[`${val.name}_to_${dictionary[val.name].links[i].target_type}_link`] == 0) {
            if (create_all) {
              const edge = {
                source: val.name,
                target: dictionary[val.name].links[i].target_type,
                exists: 0,
              };
              edges.push(edge);
            }
            continue;
          } else if (exists_in_any_nodes(val.name, nodes) && exists_in_any_nodes(dictionary[val.name].links[i].target_type, nodes)) {
            const edge = {
              source: val.name,
              target: dictionary[val.name].links[i].target_type,
            };
            if (create_all) {
              edge.exists = 1;
            }
            edges.push(edge);
          }
        }
        if (dictionary[val.name].links[i].subgroup) {
          for (let j = 0; j < dictionary[val.name].links[i].subgroup.length; j++) {
            if (dictionary[val.name].links[i].subgroup[j].target_type) {
              if (nodes_to_hide.includes(dictionary[val.name].links[i].subgroup[j].target_type) || nodes_to_hide.includes(val.name)) {
                continue;
              } else if (props.links_search == undefined || props.links_search[`${val.name}_to_${dictionary[val.name].links[i].subgroup[j].target_type}_link`] == 0) {
                if (create_all) {
                  const edge = {
                    source: val.name,
                    target: dictionary[val.name].links[i].subgroup[j].target_type,
                    exists: 0,
                  };
                  edges.push(edge);
                }
                continue;
              } else if (exists_in_any_nodes(val.name, nodes) && exists_in_any_nodes(dictionary[val.name].links[i].subgroup[j].target_type, nodes)) {
                const edge = {
                  source: val.name,
                  target: dictionary[val.name].links[i].subgroup[j].target_type,
                };
                if (create_all) {
                  edge.exists = 1;
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
    nodes,
    edges,
  };

  function exists_in_any_nodes(value, nodes) {
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].name == value) {
        return 1;
      }
    }
    return 0;
  }
}

export const color = {
  administrative: d3.schemeCategory20[12],
  clinical: d3.schemeCategory20[11],
  biospecimen: d3.schemeCategory20[16],
  metadata_file: d3.schemeCategory20b[14],
  index_file: d3.schemeCategory20[18],
  notation: d3.schemeCategory20[19],
  data_file: d3.schemeCategory20[17],
};

export function legendCreator(legend_g, nodes, legend_width, color_scheme) {
  // Find all unique categories 
  const unique_categories_array = nodes.reduce((acc, elem) => {
    if (acc.indexOf(elem.category) === -1) {
      acc.push(elem.category);
    }
    return acc;
  }, []);
  unique_categories_array.sort((a, b) => {
    a = a.toLowerCase();
    b = b.toLowerCase();
    if (a < b) {
      return -1;
    } else if (a > b) {
      return 1;
    }
    return 0;
  },
  );

  const legend_font_size = '0.9em';
  // Make Legend
  legend_g.selectAll('text')
    .data(unique_categories_array)
    .enter().append('text')
    .attr('x', legend_width / 2)
    .attr('y', (d, i) => `${1.5 * (2.5 + i)}em`)
    .attr('text-anchor', 'middle')
    .attr('fill', d => color[d])
    .style('font-size', legend_font_size)
    .text(d => d);

  legend_g.append('text')
    .attr('x', legend_width / 2)
    .attr('y', `${2}em`)
    .attr('text-anchor', 'middle')
    .text('Categories')
    .style('font-size', legend_font_size)
    .style('text-decoration', 'underline');
}


export function addArrows(graph_svg) {
  graph_svg.append('svg:defs')
    .append('svg:marker')
    .attr('id', 'end-arrow')
    .attr('viewBox', '0 -5 10 10')
    .attr('fill', 'darkgray')
    .attr('refX', 0)
    .attr('refY', 0)
    .attr('markerWidth', 6)
    .attr('markerHeight', 6)
    .attr('orient', 'auto')
    .append('svg:path')
    .attr('d', 'M0,-5L10,0L0,5');
}

export function addLinks(graph_svg, edges) {
  return graph_svg.append('g')
    .selectAll('path')
    .data(edges)
    .enter()
    .append('path')
    .attr('stroke-width', 2)
    .attr('marker-mid', 'url(#end-arrow)')
    .attr('stroke', 'darkgray')
    .attr('fill', 'none');
}


export function calculatePosition(nodes, graph_width, graph_height) {
  // Calculate the appropriate position of each node on the graph
  const fy_vals = [];
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].fx = nodes[i].position[0] * graph_width;
    nodes[i].fy = nodes[i].position[1] * graph_height;
    if (fy_vals.indexOf(nodes[i].fy) === -1) {
      fy_vals.push(nodes[i].fy);
    }
  }
  return { nodes, fy_vals_length: fy_vals.length };
}


/**
 * Type agnostic compare thunk for Array.sort
 * @param {*} a 
 * @param {*} b 
 */
export function sortCompare(a, b) {
  if (a === b) { return 0; }
  return a < b ? -1 : 1;
}
