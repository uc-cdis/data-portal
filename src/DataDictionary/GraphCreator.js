import * as d3 from "d3"; 
import React from "react";
import { Link } from 'react-router';
import { button } from '../theme';
import styled from 'styled-components';

const ToggleButton = styled.a`
  border: 1px solid darkslategray;
  color: darkslategray;
  ${button};
  position:absolute;
  top:270px;
  left:130px;
  z-index: 100;
  &:hover,
  &:active,
  &:focus {
    color: black;
    border-color: black;
  }
`;

function create_graph(nodes, edges, radius=60, box_height_mult, box_width_mult, svg_height_mult) {
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
  //.style("display", "block")
  //.style("margin-left", "auto")
  //.style("margin-right", "auto")
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
      .force("link", d3.forceLink().id(function(d) { return d.name; }))

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
}

function formatField(name) {
  if (name.length > 20) {
    let split_name = name.split('_')
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
    .data(function(row) {return Object.entries(row).filter((x)=>x[0]!='required')}) //return Object.entries(row);})
    .enter()
    .append("td")
    .style('border', '1px solid black')
    .style('padding', '5px')
    .text((d) => {return d[0] == "column" ? formatField(d[1]) : formatType(d[1])})

  for (let n = 0; n < nodes.length; n++) {
    d3.select("#".concat(nodes[n].name))
      .select("text")
      .attr("dy", -0.5*box_height+15)
      .style("display", "none")
  }
}

function create_full_graph(nodes, edges) {
  let radius = 60
  let box_height = radius * 4
  let box_width = radius * 4

  let max_x_pos = Math.round(1/d3.extent(nodes.map((node) => node.position[0]))[0])
  let max_y_pos = Math.round(1/d3.extent(nodes.map((node) => node.position[1]))[0])

  let svg_width = max_x_pos * radius * 5
  let svg_height = max_y_pos * radius * 5
  
  create_graph(nodes, edges, radius, 4, 4, 5)

  add_tables(nodes, box_width, box_height, svg_width, svg_height)
};

function create_abridged_graph(nodes, edges) {
  create_graph(nodes, edges, 60, 1.5, 3, 3)
};

export default class CreateGraph extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      full_toggle: true
    }
    this.handleClick = this.handleClick.bind(this);
  }
  componentDidMount() {
    if (this.state.full_toggle) {
      create_full_graph(this.props.nodes, this.props.edges)
    } else {
      document.getElementById("table_wrapper").remove()
      create_abridged_graph(this.props.nodes, this.props.edges)
    }
  }
  componentDidUpdate() {
    if (this.state.full_toggle) {
      create_full_graph(this.props.nodes, this.props.edges)
    } else {
      document.getElementById("table_wrapper").remove()
      create_abridged_graph(this.props.nodes, this.props.edges)
    }
  }
  handleClick() {
    this.setState(prevState => ({
      full_toggle: !prevState.full_toggle,
    }));
  }
  render() {
    let nodes = this.props.nodes
    let edges = this.props.edges

    let root = "program"
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
          if (!layout[layout_level+1]) {
            layout[layout_level+1] = [];
          } 
          queue.push(edges[i].source);
          if ((layout[layout_level+1].indexOf(edges[i].source) == -1) && (placed.indexOf(edges[i].source) == -1)) {
            if (layout[layout_level+1].length >= 3) {
              layout_level += 1;
              if (!layout[layout_level+1]) {
                layout[layout_level+1] = [];
              }
            }
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
            nodes[k].position_index = [j,i];
            break;
          }
        }
      }
    }

  let radius = 60
  let box_height = radius * 4
  let box_width = radius * 4

  let max_x_pos = Math.round(1/d3.extent(nodes.map((node) => node.position[0]))[0])
  let max_y_pos = Math.round(1/d3.extent(nodes.map((node) => node.position[1]))[0])

  let svg_width = max_x_pos * radius * 5
  let svg_height = max_y_pos * radius * 5

    const divStyle = {
      width: "inherit",
      backgroundColor: "#f4f4f4",
      margin: "0 auto",
      textAlign: "center",
      position: "relative"
    }
    return (
      <div style={{}}>
        <Link to={'/dd'}> Explore dictionary as a table </Link>
        <p style={{"fontSize": "75%", "marginTop": "1em"}}> <span style={{"fontWeight": "bold", "fontStyle": "italic"}}> Bold, italicized</span> properties are required</p>
        <ToggleButton onClick={this.handleClick}>Toggle view</ToggleButton>
        <div style={divStyle} id="graph_wrapper">
          <svg id="data_model_graph">
          </svg>
        </div>
      </div>
    );
  }
}
