import React from 'react';
import PropTypes from 'prop-types';
import { select, selectAll } from 'd3-selection';
import { forceSimulation, forceLink } from 'd3-force';
import { extent } from 'd3-array';

import { getCategoryColor, legendCreator, addArrows, addLinks, calculatePosition } from '../utils';
import { assignNodePositions } from '../GraphUtils/utils';

const d3 = {
  select, selectAll, forceSimulation, forceLink, extent,
};

/**
 * createSvgGraph: builds an SVG graph (oval nodes) in the SVG DOM
 *    node with selector: svg#data_model_graph.
 *    Needs position as property of each node (as fraction of 1 e.g. [0.5, 0.1]
 *    for placement at (0.5*svg_width, 0.1*svg_height))
 *    Side effect - decorates each node in 'nodes' with a 'position' property
 *
 * @param nodesIn
 * @param edges
 */
export function createSvgGraph(nodesIn, edges) {
  assignNodePositions(nodesIn, edges);
  // some nodes may not be linked under the root, so filter them out ...
  const nodes = nodesIn.filter(nd => !!nd.position);
  const minX = Math.round(1 / d3.extent(nodes.map(node => node.position[0]))[0]);
  const minY = Math.round(1 / d3.extent(nodes.map(node => node.position[1]))[0]);
  const maxX = Math.round(1 / d3.extent(nodes.map(node => node.position[0]))[0]);
  const maxY = Math.round(1 / d3.extent(nodes.map(node => node.position[1]))[0]);

  const padding = 25;
  const radius = 60;
  const legendWidth = 125;
  const width = (maxX * radius * 2) + legendWidth;
  const height = maxY * radius * 2;

  const svg = d3.select('#data_model_graph')
    .style('display', 'block')
    .style('background-color', '#ffffff')
    .style('margin-left', 'auto')
    .style('margin-right', 'auto');
  // Clear everything inside when re-rendering
  svg.selectAll('*').remove();

  const graph = svg.append('g')
    .attr('transform', `translate(0,${padding})`);
  // legend is the text that matches categories to color
  const legend = svg.append('g')
    .attr('transform', `translate(${width - legendWidth},${padding})`);

  const link = addLinks(graph, edges);

  addArrows(graph);

  // calculatePosition adds .fx, .fy to nodes as side effect
  const calcPosObj = calculatePosition(nodes, width, height);
  const numRows = calcPosObj.fyValsLength;
  const unclickableNodes = ['program', 'project'];
  const nodeTypes = nodes.map(node => node.id);
  const nodesForQuery = nodeTypes.filter(nt => !unclickableNodes.includes(nt));

  // Add search on clicking a node
  const node = graph.selectAll('g.gnode')
    .data(nodes)
    .enter().append('g')
    .classed('gnode', true)
    .style('cursor', (d) => {
      if (unclickableNodes.indexOf(d.id) === -1) {
        return 'pointer';
      }
      return '';
    })
    .attr('id', d => d.id)
    .on('click', (d) => {
      for (let i = 0; i < nodesForQuery.length; i += 1) {
        if (d.id === nodesForQuery[i]) {
          window.open(window.location.href.concat('/search?node_type='.concat(d.id)));
          break;
        }
      }
    });

  // Add nodes to graph
  node.append('ellipse')
    .attr('rx', radius)
    .attr('ry', radius * 0.6)
    .attr('fill', (d) => {
      if (d.count === 0) {
        return '#f4f4f4';
      }
      return getCategoryColor(d.category);
    })
    .style('stroke', (d) => {
      if (d.count === 0) {
        return getCategoryColor(d.category);
      }
      return '';
    })
    .style('stroke-width', 1);

  const graphFontSize = '0.75em';

  // Append text to nodes
  /* eslint-disable no-param-reassign */
  nodes.forEach((nodeInfo) => {
    const splitName = nodeInfo.title.split(' ');
    if (splitName.length > 2) {
      nodeInfo.adjust_text_pos = 1;
    } else {
      nodeInfo.adjust_text_pos = 0;
    }
    for (let i = 0; i < splitName.length; i += 1) {
      graph.select('#'.concat(nodeInfo.id))
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('font-size', graphFontSize)
        .attr('dy', `${(0 - (splitName.length - i - 1 - nodeInfo.adjust_text_pos)) * 0.9}em`)
        .text(splitName[i]);
    }
  });

  node.append('text')
    .text(d => (d.count))
    .attr('text-anchor', 'middle')
    .attr('font-size', graphFontSize)
    .attr('dy', (d) => {
      if (d.adjust_text_pos) {
        return '2em';
      }
      return '1em';
    });

  // part of d3 simulation (below)
  function positionLink(d) {
    if (d.source.fy === d.target.fy) {
      return `M${d.source.x},${d.source.y
      }Q${d.source.x},${d.source.y + ((height / numRows) / 3)
      } ${(d.source.x + d.target.x) / 2},${d.source.y + ((height / numRows) / 3)
      }T ${d.target.x},${d.target.y}`;
    } else if (d.source.fx === d.target.fx && (d.target.y - d.source.y) > (radius * 2)) {
      return `M${d.source.x},${d.source.y
      }Q${d.source.x + (radius * 1.25)},${d.source.y
      } ${d.source.x + (radius * 1.25)},${(d.source.y + d.target.y) / 2
      }T ${d.target.x},${d.target.y}`;
    }
    return `M${d.source.x},${d.source.y
    }L${(d.source.x + d.target.x) / 2},${(d.source.y + d.target.y) / 2
    }L${d.target.x},${d.target.y}`;
  }

  // part of d3 simulation
  function ticked() {
    link.attr('d', positionLink)
      .attr('stroke-dasharray', (d) => {
        if (d.exists === 0) {
          return '5, 5';
        }
        return '0';
      });

    node
      .attr('cx', (d) => { d.x = Math.max(radius, Math.min(width - radius, d.x)); return d.x; })
      .attr('cy', (d) => { d.y = Math.max(radius, Math.min(height - radius, d.y)); return d.y; })
      .attr('transform', d => `translate(${[d.x, d.y]})`);
  }

  // d3 "forces" layout - see http://d3indepth.com/force-layout/
  const simulation = d3.forceSimulation()
    .force('link', d3.forceLink().id(d => d.id));

  // Put the nodes and edges in the correct spots
  simulation
    .nodes(nodes)
    .on('tick', ticked);

  simulation.force('link')
    .links(edges);

  legendCreator(legend, nodes, legendWidth);
  return { minX, minY };
}


/**
 * SVG graph based on given nodes and edges - assumes
 * graph is basically a tree structure that can be
 * layed out breadth first.
 */
class SvgGraph extends React.Component {
  constructor(props) {
    super(props);
    this.state = { minX: 100, minY: 100 };
  }

  componentDidMount() {
    /* FIXME:
     * work around to mute linting warning about setting state
     * in componentDidMount()
     */
    this.onMount();
  }


  componentDidUpdate() {
    /* FIXME:
     * work around to mute linting warning about setting state
     * in componentDidUpdate()
     */
    this.onUpdate();
  }

  onMount = () => {
    //
    // This is crazy, because createSvgGraph is going to add nodes
    // to the react-managed DOM via a d3 simulation ...
    //
    const { minX, minY } = createSvgGraph(this.props.nodes, this.props.edges);
    if (minX !== this.state.minX || minY !== this.state.minY) {
      // this will result eventually in this.componentDidUpdate ...
      //    https://reactjs.org/docs/react-component.html#componentwillupdate
      this.setState(Object.assign(this.state, { minX, minY }));
    }
  }

  onUpdate = () => {
    // break recursion with if: componentDidUpdate -> setState -> componentDidUpdate ...
    //        https://reactjs.org/docs/react-component.html#componentwillupdate
    if (this.state.nodes !== this.props.nodes || this.state.edges !== this.props.edges) {
      // createSvgGraph adds nodes to the DOM
      const { minX, minY } = createSvgGraph(this.props.nodes, this.props.edges);
      if (minX !== this.state.minX || minY !== this.state.minY) {
        // Need to 'setState' to force a repaint when size of graph changes - something like that
        // is going on
        this.setState(
          Object.assign(this.state,
            { minX, minY, nodes: this.props.nodes, edges: this.props.edges },
          ),
        );
      }
    }
  }

  render() {
    const { minX, minY } = this.state;

    const padding = 25;
    const radius = 60;
    const legendWidth = 125;
    const width = (minX * radius * 2) + legendWidth;
    const height = (minY * radius * 2) + padding;

    const divStyle = {
      height,
      backgroundColor: '#ffffff',
      marginLeft: 'auto',
      marginTop: '10px',
      marginRight: 'auto',
    };
    return (
      <div style={divStyle}>
        <svg id='data_model_graph' height={height} width={width} />
      </div>
    );
  }
}

SvgGraph.propTypes = {
  nodes: PropTypes.arrayOf(PropTypes.object).isRequired,
  edges: PropTypes.arrayOf(PropTypes.object).isRequired,
};

SvgGraph.defaultProps = {
  nodes: [],
  edges: [],
};

export default SvgGraph;
