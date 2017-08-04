import * as d3 from "d3"; 
import React from "react";
import { color, legend_creator, add_arrows, add_links, calculate_position } from "../utils"

/**
 * create_dd_graph: Creates a Data Dictionary graph (rectangular nodes).
 *    Needs position as property of each node (as fraction of 1 e.g. [0.5, 0.1] 
 *    for placement at (0.5*svg_width, 0.1*svg_height))
 */
function create_dd_graph(nodes, edges, radius=60, box_height_mult, box_width_mult, svg_height_mult) {
  let max_x_pos = Math.round(1/d3.extent(nodes.map((node) => node.position[0]))[0])
  let max_y_pos = Math.round(1/d3.extent(nodes.map((node) => node.position[1]))[0])

  let padding = 25, 
    legend_width=125,
    width = max_x_pos * radius * 5, 
    height = max_y_pos * radius * svg_height_mult;

  let box_height = radius * box_height_mult
  let box_width = radius * box_width_mult

  d3.select("#graph_wrapper")
    .style("height", height + "px")

  let svg;
  svg = d3.select("#data_model_graph")
  .style("position", "absolute")
  .style("left", "50%")
    .style("transform", "translate(" + -width/2 + "px" + ",0)")
        .attr("height", height)
        .attr("width", width)
  // Clear everything inside when re-rendering
  svg.selectAll("*").remove();

  let graph = svg.append("g")
    .attr("transform", "translate(0,"+padding+")");
  // legend is the text that matches categories to color
  let legend = svg.append("g")
    .attr("transform", "translate(" + (width-legend_width*2) + "," + padding + ")");

  let link = add_links(graph, edges)

  add_arrows(graph)

  let calc_pos_obj = calculate_position(nodes, width, height);
  let num_rows = calc_pos_obj.fy_vals_length;
  nodes = calc_pos_obj.nodes;

  let node_types = nodes.map((node) => node.name)

  // Add search on clicking a node
  let node = graph.selectAll("g.gnode")
    .data(nodes)
    .enter().append("g")
      .classed("gnode", true)
      .style('cursor', 'pointer')
      .attr("id", function(d) {return d.name})
      .on('click', function(d) {
        for (let i = 0; i < node_types.length; i++) {
          if (d.name == node_types[i]) {
            let s = window.location.href.split("/")
            window.open(s.slice(0, s.length-1).join("/") + "/" + d.name);
            break;
          }
        }
      });

  // Add nodes to graph
  node.append("rect")
      .attr("width", box_width)
      .attr("height", box_height)
      .attr("fill", function(d) { 
        return "#f4f4f4"
      })
      .attr("transform", "translate(" + box_width*-0.5 + "," + box_height*-0.5 + ")")
      .style("stroke", function (d) {
        return color[d.category]
      })
      .style("stroke-width", 3)

  let graph_font_size = "0.75em"

  // Append text to nodes
  for (let n = 0; n < nodes.length; n++) {
    graph.select("#".concat(nodes[n].name))
      .append("text")
      .attr("text-anchor", "middle")
      .attr("font-size", graph_font_size)
      .style("font-weight", "bold")
      .text(nodes[n].name);
  }

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

    node
        .attr("cx", function(d) { return d.x = Math.max(radius, Math.min(width - radius, d.x)); })
        .attr("cy", function(d) { return d.y = Math.max(radius, Math.min(height - radius, d.y)); })
        .attr("transform", function(d) {
          return 'translate(' + [d.x, d.y] + ')';
        });
  }
  function positionLink(d) {
    if (d.source.fy == d.target.fy && Math.abs(d.source.position_index[0] - d.target.position_index[0]) > 1) {
      let curve =  "M" + d.source.x + "," + d.source.y
        + "Q" + d.source.x + "," + (d.source.y + box_height/2*1.25)
        + " " + (d.source.x + d.target.x)/2 + "," + (d.source.y + box_height/2*1.25)
        + "T" + " " + d.target.x + "," + d.target.y;
      return curve;
    } else if (d.source.fx == d.target.fx && Math.abs(d.source.position_index[1] - d.target.position_index[1]) > 1) {
      let curve =  "M" + d.source.x + "," + d.source.y
        + "Q" + (d.source.x + box_width/2*1.25) + "," + d.source.y
        + " " + (d.source.x + box_width/2*1.25) + "," + ((d.source.y + d.target.y)/2)
        + "T" + " " + d.target.x + "," + d.target.y;
      return curve;
    } else if ((Math.abs(d.source.position_index[0] - d.target.position_index[0]) == Math.abs(d.source.position_index[1] - d.target.position_index[1])) && Math.abs(d.source.position_index[1] - d.target.position_index[1]) >= 2 ) {
      let curve =  "M" + d.source.x + "," + d.source.y
        + "Q" + d.source.x + "," + (2*d.source.y + d.target.y)/3
        + " " + ((2*d.source.x + d.target.x)/3) + "," + ((d.source.y + 2*d.target.y)/3)
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

/**
 * formatField: Recurisvely inserts newline characters into strings that are 
 *    too long after underscores
 */
function formatField(name) {
  if (name.length > 20) {
    let split_name = name.split('_')
    if (split_name.length == 1) {
      return name
    }
    let mid = Math.ceil(split_name.length/2)
    let begin = split_name.slice(0, mid).join('_')
    let end = split_name.slice(mid).join('_')
    if (begin.length > 20) {
      begin = formatField(begin)
    } 
    if (end.length > 20) {
      end = formatField(end)
    } 
    return  begin + '_\n' + end
  } else {
    return name
  }
}

/** 
 * formatType: Turn different ways used to represent type in data dictionary 
 *    into a string
 */
function formatType(type) {
  if (typeof type == 'string') {
    return type
  } else if ('type' in type) {
    if (typeof type.type != 'string') {
      let filtered_type = type.type.filter((x)=>x!='null')
      filtered_type = filtered_type.join(',\n')
      return filtered_type
    }
    return type.type;
  } else if ('enum' in type) {
    return 'enum'
  } else if ('oneOf' in type) {
    if (typeof type.oneOf == 'object' && 'enum' in type.oneOf[0] && type.oneOf[0].enum[0] == 'uploading') {
      if ('downloadable' in type) {
        return 'enum'
      }
    }
    let filtered_type = type.oneOf.map((x)=>x.type)
    filtered_type = filtered_type.filter((x)=>x!='null')
    if (type.oneOf.length > 2) {
      return filtered_type.slice(0, 2).join(', \n') + ", etc.";
    } else {
      return filtered_type.join(', \n');
    }
  }  else {
    console.log("Unexpected: ", type)
  }
}

/**
 * add_tables: Add tables to data dictionary graph.
 *    Also hides the node names rendered by svg and replaces them with non-svg
 *    text so they remain clickable
 */
function add_tables(nodes, box_width, box_height, svg_width, svg_height) {
  let table_div = d3.select("#graph_wrapper")
  .append('div')
    .style("position", "absolute")
    .style("left", "50%")
    .style("top", "0")
    .style("margin-left", svg_width/-2 + "px")
    .style("width", svg_width + "px")
    .style("height", svg_height + "px")
    .attr("id", "table_wrapper")
    .selectAll('div')
    .data(nodes)
    .enter()
  .append('div')
    .style("position", "absolute")
    .style("left", (d) => (d.fx - box_width/2 + 6) + "px")
    .style("top", (d) => (d.fy - box_height/2 + 20) + "px")

  table_div.append('a')
    .attr("href", (d) => {
      let uri = window.location.href
      return uri.substring(0, uri.lastIndexOf('/')) + "/" + d.name
    })
    .attr("target", "_blank")
    .style("font-size", 13 + "px")
    .style("color", "black")
    .style("font-weight", "bold")
    .text((d) => d.name)

  table_div.append('div')
    .style("width", box_width-12 + "px")
    .style("height", box_height-30+ "px")
    .style("font-size", 12 + "px")
    .style("color", "black")
    .style("overflow", "auto")
  .append('table')
    .style('border-collapse', 'collapse')
    .style('border', '1px solid black')
    .style('width', '100%')
  .append('tbody')
    .selectAll('tr')
    .data(function(d) {
      let unsorted_arr = Object.entries(d.properties).filter((x) => {return !('anyOf' in x[1])}).map((x) => { return {column: x[0], value: x[1]}})
      let required_arr = []
      let not_required_arr = []
      unsorted_arr.forEach((val) => {
        if (d.required != undefined && d.required.indexOf(val.column)!=-1) {
          val.required = true
          required_arr.push(val)
        } else {
          val.required = false
          not_required_arr.push(val)
        }
      })
      return required_arr.concat(not_required_arr)
    })
    .enter()
  .append("tr")
    .style('border', '1px solid black')
    .style('padding', '5px')
    .style('font-weight', (d) => d.required ? 'bold' : 'normal')
    .style('font-style', (d) => d.required ? 'italic' : 'normal')
    .selectAll("td")
    .data(function(row) {return Object.entries(row).filter((x)=>x[0]!='required')}) 
    .enter()
    .append("td")
    .style('border', '1px solid black')
    .style('padding', '5px')
    .text((d) => {return d[0] == "column" ? formatField(d[1]) : formatType(d[1])})

  for (let n = 0; n < nodes.length; n++) {
    d3.select("#".concat(nodes[n].name))
      .selectAll("text")
      .attr("dy", -0.5*box_height+15)
      .style("display", "none")
  }

  d3.select("#graph_wrapper").select("a").style("z-index", "1")
}

export function create_full_graph(nodes, edges) {
  let radius = 60
  let box_height = radius * 4
  let box_width = radius * 4

  let max_x_pos = Math.round(1/d3.extent(nodes.map((node) => node.position[0]))[0])
  let max_y_pos = Math.round(1/d3.extent(nodes.map((node) => node.position[1]))[0])

  let svg_width = max_x_pos * radius * 5
  let svg_height = max_y_pos * radius * 5
  
  create_dd_graph(nodes, edges, radius, 4, 4, 5)

  if (document.getElementById("table_wrapper") != null) {
    document.getElementById("table_wrapper").remove();
  }
  
  add_tables(nodes, box_width, box_height, svg_width, svg_height)
};

export function create_abridged_graph(nodes, edges) {
  create_dd_graph(nodes, edges, 60, 1.5, 3, 3)
};
