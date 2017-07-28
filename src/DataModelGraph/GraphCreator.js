import * as d3 from "d3";
import React from "react";

function create_graph(nodes, edges) {
  let min_x_pos = Math.round(1/d3.extent(nodes.map((node) => node.position[0]))[0])
  let min_y_pos = Math.round(1/d3.extent(nodes.map((node) => node.position[1]))[0])

  let padding = 25, 
    radius = 60,
    legend_width=125,
    width = min_x_pos * radius * 2 + legend_width, 
    height = min_y_pos * radius * 2;

  let svg;
  svg = d3.select("#data_model_graph")
        .style("display", "block")
        .style("margin-left", "auto")
        .style("margin-right", "auto")
        .attr("border", 1)
  // Clear everything inside when re-rendering
  svg.selectAll("*").remove();

  let graph = svg.append("g")
    .attr("transform", "translate(0,"+padding+")");
  // legend is the text that matches categories to color
  let legend = svg.append("g")
    .attr("transform", "translate(" + (width-legend_width) + "," + padding + ")");

  let defs = graph.append('svg:defs');
  defs.append('svg:marker')
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

  let color = {
    "administrative": d3.schemeCategory20[12],
    "clinical": d3.schemeCategory20[11],
    "biospecimen": d3.schemeCategory20[16],
    "metadata_file": d3.schemeCategory20b[14],
    "index_file": d3.schemeCategory20[18],
    "notation": d3.schemeCategory20[19],
    "data_file": d3.schemeCategory20[17],
  }

  let simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id(function(d) { return d.name; }).strength(0.2))
      .force("collision", d3.forceCollide(radius*1.1));

  let link = graph.append("g")
    .selectAll("path")
    .data(edges)
    .enter().append("path")
      .attr("stroke-width", 2)
      .attr("marker-mid", "url(#end-arrow)")
      .attr("stroke", "darkgray")
      .attr("fill", "none");

  // Calculate the appropriate position of each node on the graph
  let fy_vals = []; 
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].fx = nodes[i].position[0]*width;
    nodes[i].fy = nodes[i].position[1]*height;
    if (fy_vals.indexOf(nodes[i].fy) == -1) {
      fy_vals.push(nodes[i].fy);
    }
  }
  let num_rows = fy_vals.length;

  let unclickable_nodes = ['program', 'project']
  let node_types = nodes.map((node) => node.name)
  let nodes_for_query = node_types.filter((nt) => !unclickable_nodes.includes(nt));

  // Add search on clicking a node
  let node = graph.selectAll("g.gnode")
    .data(nodes)
    .enter().append("g")
      .classed("gnode", true)
      .style('cursor', 'pointer')
      .attr("id", function(d) {return d.name})
      .on('click', function(d) {
        for (let i = 0; i < nodes_for_query.length; i++) {
          if (d.name == nodes_for_query[i]) {
              window.open(window.location.href.concat("/search?node_type=".concat(d.name)));
            break;
          }
        }
      });

  // Find all unique categories 
  let unique_categories_array = nodes.reduce((acc, elem) => {
    if (acc.indexOf(elem.category) === -1) {
      acc.push(elem.category);
    }
    return acc;
  }, []);
  unique_categories_array.sort(function(a, b) {
      a = a.toLowerCase();
      b = b.toLowerCase();
      if (a < b) {
        return -1;
      } else if (a > b) {
        return 1;
      } else {
        return 0;
      }
    }
  )

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

  let legend_font_size = "0.9em"
  //Make Legend
  legend.selectAll("text")
    .data(unique_categories_array)
    .enter().append("text")
    .attr("x", legend_width/2)
    .attr("y", function(d, i) {
      return (1.5*(2.5+i))+"em";
    })
    .attr("text-anchor", "middle")
    .attr("fill", function(d) { return color[d]})
    .style("font-size", legend_font_size)
    .text(function(d) {return d});

  legend.append("text")
    .attr("x", legend_width/2)
    .attr("y", 2 +"em")
    .attr("text-anchor", "middle")
    .text("Categories")
    .style("font-size", legend_font_size)
    .style("text-decoration", "underline");

};

export default class CreateGraph extends React.Component {
  componentDidMount() {
    create_graph(this.props.nodes, this.props.edges)
  }
  componentDidUpdate() {
    create_graph(this.props.nodes, this.props.edges)
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

