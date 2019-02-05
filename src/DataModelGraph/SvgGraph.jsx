import React from 'react';
import PropTypes from 'prop-types';
import { select, selectAll } from 'd3-selection';
import { extent } from 'd3-array';

import { getCategoryColor, legendCreator, addArrows, calculatePosition } from '../utils';
import { assignNodePositions } from '../GraphUtils/utils';

const d3 = {
  select, selectAll, extent,
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
export function createSvgGraph(nodesIn, edgesIn) {
  assignNodePositions(nodesIn, edgesIn);
  // some nodes may not be linked under the root, so filter them out ...
  const nodes = nodesIn.filter(nd => !!nd.position);

  // filter out edges that shouldn't be rendered in this graph
  const edges = edgesIn
    .filter(e => nodes.find(n => n.id === e.source.id) || nodes.find(n => n.id === e.target.id));

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

  addArrows(graph);

  // calculatePosition adds .fx, .fy to nodes as side effect
  const calcPosObj = calculatePosition(nodes, width, height);
  const numRows = calcPosObj.fyValsLength;
  const unclickableNodes = ['program', 'project'];
  const nodeTypes = nodes.map(node => node.id);
  const nodesForQuery = nodeTypes.filter(nt => !unclickableNodes.includes(nt));

  // Add links to graph
  function positionLink(d) {
    if (d.source.fy === d.target.fy) {
      return `M${d.source.fx},${d.source.fy
      }Q${d.source.fx},${d.source.fy + ((height / numRows) / 3)
      } ${(d.source.fx + d.target.fx) / 2},${d.source.fy + ((height / numRows) / 3)
      }T ${d.target.fx},${d.target.fy}`;
    } else if (d.source.fx === d.target.fx && (d.target.fy - d.source.fy) > (radius * 2)) {
      return `M${d.source.fx},${d.source.fy
      }Q${d.source.fx + (radius * 1.25)},${d.source.fy
      } ${d.source.fx + (radius * 1.25)},${(d.source.fy + d.target.fy) / 2
      }T ${d.target.fx},${d.target.fy}`;
    }
    return `M${d.source.fx},${d.source.fy
    }L${(d.source.fx + d.target.fx) / 2},${(d.source.fy + d.target.fy) / 2
    }L${d.target.fx},${d.target.fy}`;
  }
  graph.append('g')
    .selectAll('path')
    .data(edges)
    .enter()
    .append('path')
    .classed('gpath', true)
    .attr('d', d => positionLink(d))
    .attr('stroke-width', 2)
    .attr('marker-mid', 'url(#end-arrow)')
    .attr('stroke', 'darkgray')
    .attr('fill', 'none')
    .attr('stroke-dasharray', (d) => {
      if (d.exists === 0) {
        return '5, 5';
      }
      return '0';
    });

  // Add search on clicking a node
  const node = graph.selectAll('g.gnode')
    .data(nodes)
    .enter().append('g')
    .classed('gnode', true)
    .attr('transform', d => `translate(${[d.fx, d.fy]})`)
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
