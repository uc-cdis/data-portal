import * as d3 from "d3";
import React from "react";
import { connect } from 'react-redux';
import { submitSearchForm } from '../QueryNode/actions';

class Create_graph_component extends React.Component {
  componentWillUnmount() {
    d3.select("#data_model_graph").remove();
  }
  render() {
    var global_this = this;
    function create_graph(nodes, edges) {

      function handleQuerySubmit (event) {
        event.preventDefault();
        let form = event.target;
        let data = {project: global_this.props.project}
        for (let i =0; i<form.length; i++){
          let input = form[i];
          data[input.name] = input.value;
        }
        global_this.props.onSearchFormSubmit(data);
      }
      
      var min_x_pos = nodes[0].position[0];
      var min_y_pos = nodes[0].position[1];
      for (var i = 1; i < nodes.length; i++) {
        if (min_x_pos > nodes[i].position[0]) {
          min_x_pos = nodes[i].position[0];
        }
        if (min_y_pos > nodes[i].position[1]) {
          min_y_pos = nodes[i].position[1];
        }
      }

      min_x_pos = Math.round(1/min_x_pos);
      min_y_pos = Math.round(1/min_y_pos);

      var radius = 60;

      var legend_width=125, 
        padding = 25;
      var width = min_x_pos * radius * 2 + legend_width, 
        height = min_y_pos * radius * 2;

      var body = document.body,
            html = document.documentElement;

      var body_width = Math.max( body.scrollWidth, body.offsetWidth, 
                               html.clientWidth, html.scrollWidth, html.offsetWidth );

      var svg;
      if (document.getElementById("data_model_graph")) {
        svg = d3.select("#data_model_graph")
        svg.selectAll("*").remove();
        var borderPath = svg.append("rect")
          .attr("x", 0)
          .attr("y", padding)
          .attr("height", height)
          .attr("width", width)
          .style("stroke", "black")
          .style("fill", "none")
          .style("stroke-width", 3)
      } else {
        var svg = d3.select(".kDnxyk").append("svg")
          .attr("width", width)
          .attr("height", height + padding)
          .attr("id", "data_model_graph")
          .style("display", "block")
          .style("margin-left", "auto")
          .style("margin-right", "auto")
          .attr("border", 1)
        var borderPath = svg.append("rect")
          .attr("x", 0)
          .attr("y", padding)
          .attr("height", height)
          .attr("width", width)
          .style("stroke", "black")
          .style("fill", "none")
          .style("stroke-width", 3)
      }

      var graph = svg.append("g")
        .attr("transform", "translate(0,"+padding+")");
      var legend = svg.append("g")
        .attr("transform", "translate(" + (width-legend_width) + "," + padding + ")");

      var defs = graph.append('svg:defs');
      defs.append('svg:marker')
        .attr('id', 'end-arrow')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 0)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('svg:path')
          .attr('d', 'M0,-5L10,0L0,5');

      var color = d3.scaleOrdinal(d3.schemeCategory10);

      var simulation = d3.forceSimulation()
          .force("link", d3.forceLink().id(function(d) { return d.name; }).strength(0.2))
          .force("collision", d3.forceCollide(radius*1.1));

      var link = graph.append("g")
        .selectAll("path")
        .data(edges)
        .enter().append("path")
          .attr("stroke-width", 2)
          .attr("marker-mid", "url(#end-arrow)")
          .attr("stroke", "black")
          .attr("fill", "none");

      var fy_vals = []; 
      for (var i = 0; i < nodes.length; i++) {
        nodes[i].fx = nodes[i].position[0]*width;
        nodes[i].fy = nodes[i].position[1]*height;
        if (fy_vals.indexOf(nodes[i].fy) == -1) {
          fy_vals.push(nodes[i].fy);
        }
      }
      var num_rows = fy_vals.length;

      var nodes_for_query = global_this.props.node_types.filter((nt) => !['program', 'project'].includes(nt));
      var options = nodes_for_query.map( (node_type) => {return {value: node_type, label: node_type}});

      var node = graph.selectAll("g.gnode")
        .data(nodes)
        .enter().append("g")
          .classed("gnode", true)
          .attr("id", function(d) {return d.name})
          .on('click', function(d) {
            for (var i = 0; i < nodes_for_query.length; i++) {
              if (d.name == nodes_for_query[i]) {
                console.log("Clicked on " + d.name);
                  window.open(window.location.href.concat("/search?node_type=".concat(d.name)));
                break;
              }
            }
          });


      function create_unique_categories_array(nodes) {
        var unique_categories = [];
        for (var i = 0; i < nodes.length; i++) {
          if (unique_categories.indexOf(nodes[i].category) === -1) {
            unique_categories.push(nodes[i].category);
          }
        }
        return unique_categories;
      }

      var unique_categories_array = create_unique_categories_array(nodes);

      node.append("ellipse")
          .attr("rx", radius)
          .attr("ry", radius/2)
          .attr("fill", function(d) { return color(unique_categories_array.indexOf(d.category)); });

      var graph_font_size = "0.75em"

      for (var n = 0; n < nodes.length; n++) {
        var split_name = nodes[n].name.split("_");
        for (var i = 0; i < split_name.length; i++) {
          if (split_name.length > 2) {
            nodes[n].adjust_pos = 1;
          } else {
            nodes[n].adjust_pos = 0;
          }
          graph.select("#".concat(nodes[n].name))
            .append("text")
            .attr("text-anchor", "middle")
            .attr("font-size", graph_font_size)
            .attr("dy", (0-(split_name.length-i-1)+nodes[n].adjust_pos)*0.9+'em')
            .text(split_name[i]);
        }
      }
      node.append("text")
        .text(function(d) { return (d.count); })
        .attr("text-anchor", "middle")
        .attr("font-size", graph_font_size)
        .attr("dy", function(d) {
          if (d.adjust_pos) {
            return "2em";
          } else {
            return "1em";
          }
        });

      simulation
          .nodes(nodes)
          .on("tick", ticked);

      simulation.force("link")
          .links(edges)
          .distance(radius * 3);

      function ticked() {
        link.attr("d", positionLink);

        node
            .attr("cx", function(d) { return d.x = Math.max(radius, Math.min(width - radius, d.x)); })
            .attr("cy", function(d) { return d.y = Math.max(radius, Math.min(height - radius, d.y)); })
            .attr("transform", function(d) {
              return 'translate(' + [d.x, d.y] + ')';
            });
      }
      function positionLink(d) {
        if (d.source.fy == d.target.fy) {
          var curve =  "M" + d.source.x + "," + d.source.y
            + "Q" + d.source.x + "," + (d.source.y + (height/num_rows)/3)
            + " " + (d.source.x + d.target.x)/2 + "," + (d.source.y + (height/num_rows)/3)
            + "T" + " " + d.target.x + "," + d.target.y;
          return curve;
        } else {
          return "M" + d.source.x + "," + d.source.y
              + "L" + (d.source.x + d.target.x)/2 + "," + (d.source.y + d.target.y)/2
              + "L" + d.target.x + "," + d.target.y;
        }
      }


      var legend_font_size = "0.9em"
      //Make Legend
      legend.selectAll("text")
        .data(unique_categories_array)
        .enter().append("text")
        .attr("x", legend_width/2)
        .attr("y", function(d, i) {
          return (1.5*(2.5+i))+"em";
        })
        .attr("text-anchor", "middle")
        .attr("fill", function(d, i) { return color(i)})
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
    return (
      <div>
        {create_graph(this.props.nodes, this.props.edges)}
      </div>
      );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSearchFormSubmit: (value) => dispatch(submitSearchForm(value)),
  };
}

const Create_graph = connect(mapStateToProps, mapDispatchToProps)(Create_graph_component);
export default Create_graph;
