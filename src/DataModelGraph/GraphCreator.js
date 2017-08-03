import * as d3 from "d3";
import React from "react";
import { color, legend_creator, add_arrows, add_links, calculate_position } from "../utils"

/**
 * create_dm_graph: Creates a Data Model graph (oval nodes).
 *    Needs position as property of each node (as fraction of 1 e.g. [0.5, 0.1] 
 *    for placement at (0.5*svg_width, 0.1*svg_height))
 */
export function create_dm_graph(nodes, edges) {
  let max_x_pos = Math.round(1/d3.extent(nodes.map((node) => node.position[0]))[0])
  let max_y_pos = Math.round(1/d3.extent(nodes.map((node) => node.position[1]))[0])

  let padding = 25, 
    radius = 60,
    legend_width=125,
    width = max_x_pos * radius * 2 + legend_width, 
    height = max_y_pos * radius * 2;

  let svg;
  svg = d3.select("#data_model_graph")
        .style("display", "block")
        .style("margin-left", "auto")
        .style("margin-right", "auto")
  // Clear everything inside when re-rendering
  svg.selectAll("*").remove();

  let graph = svg.append("g")
    .attr("transform", "translate(0,"+padding+")");
  // legend is the text that matches categories to color
  let legend = svg.append("g")
    .attr("transform", "translate(" + (width-legend_width) + "," + padding + ")");

  let link = add_links(graph, edges)

  add_arrows(graph)

  let calc_pos_obj = calculate_position(nodes, width, height);
  let num_rows = calc_pos_obj.fy_vals_length;
  nodes = calc_pos_obj.nodes;

  let unclickable_nodes = ['program', 'project']
  let node_types = nodes.map((node) => node.name)
  let nodes_for_query = node_types.filter((nt) => !unclickable_nodes.includes(nt));

  // Add search on clicking a node
  let node = graph.selectAll("g.gnode")
    .data(nodes)
    .enter().append("g")
      .classed("gnode", true)
      .style('cursor', function(d) {
        if (unclickable_nodes.indexOf(d.name) == -1) {
          return 'pointer'
        } else {
          return ''
        }
      })
      .attr("id", function(d) {return d.name})
      .on('click', function(d) {
        for (let i = 0; i < nodes_for_query.length; i++) {
          if (d.name == nodes_for_query[i]) {
              window.open(window.location.href.concat("/search?node_type=".concat(d.name)));
            break;
          }
        }
      });

  // Add nodes to graph
  node.append("ellipse")
      .attr("rx", radius)
      .attr("ry", radius* 0.6)
      .attr("fill", function(d) { 
        if (d.count == 0) {
          return "#f4f4f4"
        } else { 
          return color[d.category]; 
        }
      })
    .style("stroke", function (d) {
      if (d.count == 0) {
        return color[d.category]
      } else {
        return ""
      }
    })
      .style("stroke-width", 1)

  let graph_font_size = "0.75em"

  // Append text to nodes
  for (let n = 0; n < nodes.length; n++) {
    let split_name = nodes[n].name.split("_");
    for (let i = 0; i < split_name.length; i++) {
      if (split_name.length > 2) {
        nodes[n].adjust_text_pos = 1;
      } else {
        nodes[n].adjust_text_pos = 0;
      }
      graph.select("#".concat(nodes[n].name))
        .append("text")
        .attr("text-anchor", "middle")
        .attr("font-size", graph_font_size)
        .attr("dy", (0-(split_name.length-i-1)+nodes[n].adjust_text_pos)*0.9+'em')
        .text(split_name[i]);
    }
  }
  node.append("text")
    .text(function(d) { return (d.count); })
    .attr("text-anchor", "middle")
    .attr("font-size", graph_font_size)
    .attr("dy", function(d) {
      if (d.adjust_text_pos) {
        return "2em";
      } else {
        return "1em";
      }
    });

  let simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id(function(d) { return d.name; }))

  // Put the nodes and edges in the correct spots
  simulation
      .nodes(nodes)
      .on("tick", ticked);

  simulation.force("link")
      .links(edges)

  function ticked() {
    link.attr("d", positionLink)
      .attr("stroke-dasharray", function(d) {
        if (d.exists != undefined && d.exists == 0) {
          return "5, 5";
        } else {
          return "0";
        }
      });

    node
        .attr("cx", function(d) { return d.x = Math.max(radius, Math.min(width - radius, d.x)); })
        .attr("cy", function(d) { return d.y = Math.max(radius, Math.min(height - radius, d.y)); })
        .attr("transform", function(d) {
          return 'translate(' + [d.x, d.y] + ')';
        });
  }
  function positionLink(d) {
    if (d.source.fy == d.target.fy) {
      let curve =  "M" + d.source.x + "," + d.source.y
        + "Q" + d.source.x + "," + (d.source.y + (height/num_rows)/3)
        + " " + (d.source.x + d.target.x)/2 + "," + (d.source.y + (height/num_rows)/3)
        + "T" + " " + d.target.x + "," + d.target.y;
      return curve;
    } else if (d.source.fx == d.target.fx && (d.target.y - d.source.y) > (radius * 2)) {
      let curve =  "M" + d.source.x + "," + d.source.y
        + "Q" + (d.source.x + radius*1.25) + "," + d.source.y
        + " " + (d.source.x + radius*1.25) + "," + ((d.source.y + d.target.y)/2)
        + "T" + " " + d.target.x + "," + d.target.y;
      return curve;
    } else {
      return "M" + d.source.x + "," + d.source.y
          + "L" + (d.source.x + d.target.x)/2 + "," + (d.source.y + d.target.y)/2
          + "L" + d.target.x + "," + d.target.y;
    }
  }

  legend_creator(legend, nodes, legend_width, color)
}
