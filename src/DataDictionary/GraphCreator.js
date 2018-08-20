// import * as d3 from 'd3';
import { select, selectAll } from 'd3-selection';
import { forceSimulation, forceLink } from 'd3-force';
import { extent } from 'd3-array';

import { color, legendCreator, addArrows, addLinks, calculatePosition } from '../utils';

const d3 = {
  select, selectAll, forceSimulation, forceLink, extent,
};


/**
 * createDDGraph: Creates a Data IcoDictionary graph (rectangular nodes).
 *    Needs position as property of each node (as fraction of 1 e.g. [0.5, 0.1]
 *    for placement at (0.5*svgWidth, 0.1*svgHeight))
 */
function createDDGraph(nodesIn, edges, radius = 60, boxHeightMult, boxWidthMult, svgHeightMult) {
  const nodes = nodesIn.filter(nd => !!nd.position); // ignore anchorless nodes
  const maxX = Math.round(1 / d3.extent(nodes.map(node => node.position[0]))[0]);
  const maxY = Math.round(1 / d3.extent(nodes.map(node => node.position[1]))[0]);

  const padding = 25;
  const legendWidth = 125;
  const width = maxX * radius * 5;
  const height = maxY * radius * svgHeightMult;

  const boxHeight = radius * boxHeightMult;
  const boxWidth = radius * boxWidthMult;

  d3.select('#graph_wrapper')
    .style('height', `${height}px`);

  const svg = d3.select('#data_model_graph')
    .style('position', 'absolute')
    .style('left', '50%')
    .style('transform', `translate(${-width / 2}px,0)`)
    .attr('height', height)
    .attr('width', width);
  // Clear everything inside when re-rendering
  svg.selectAll('*').remove();

  const graph = svg.append('g')
    .attr('transform', `translate(0,${padding})`);
  // legend is the text that matches categories to color
  const legend = svg.append('g')
    .attr('transform', `translate(${width - (2 * legendWidth)},${padding})`);

  const link = addLinks(graph, edges);

  addArrows(graph);
  calculatePosition(nodes, width, height); // augments nodes as side effect
  const nodeTypes = nodes.map(node => node.id);

  // Add search on clicking a node
  const node = graph.selectAll('g.gnode')
    .data(nodes)
    .enter().append('g')
    .classed('gnode', true)
    .style('cursor', 'pointer')
    .attr('id', d => d.id)
    .on('click', (d) => {
      for (let i = 0; i < nodeTypes.length; i += 1) {
        if (d.id === nodeTypes[i]) {
          const s = window.location.href.split('/');
          window.open(`${s.slice(0, s.length - 1).join('/')}/${d.id}`);
          break;
        }
      }
    });

  // Add nodes to graph
  node.append('rect')
    .attr('width', boxWidth)
    .attr('height', boxHeight)
    .attr('fill', () => '#f4f4f4')
    .attr('transform', `translate(${boxWidth * -0.5},${boxHeight * -0.5})`)
    .style('stroke', d => color[d.category])
    .style('stroke-width', 3);

  const fontSize = '0.75em';

  // Append text to nodes
  for (let n = 0; n < nodes.length; n += 1) {
    graph.select('#'.concat(nodes[n].id))
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('font-size', fontSize)
      .style('font-weight', 'bold')
      .text(nodes[n].title);
  }

  const simulation = d3.forceSimulation()
    .force('link', d3.forceLink().id(d => d.id));


  function positionLink(d) {
    if (d.source.fy === d.target.fy &&
      Math.abs(d.source.positionIndex[0] - d.target.positionIndex[0]) > 1
    ) {
      return `M${d.source.x},${d.source.y
      }Q${d.source.x},${d.source.y + ((boxHeight / 2) * 1.25)
      } ${(d.source.x + d.target.x) / 2},${d.source.y + ((boxHeight / 2) * 1.25)
      }T ${d.target.x},${d.target.y}`;
    } else if (d.source.fx === d.target.fx &&
      Math.abs(d.source.positionIndex[1] - d.target.positionIndex[1]) > 1
    ) {
      return `M${d.source.x},${d.source.y
      }Q${d.source.x + ((boxWidth / 2) * 1.25)},${d.source.y
      } ${d.source.x + ((boxWidth / 2) * 1.25)},${(d.source.y + d.target.y) / 2
      }T ${d.target.x},${d.target.y}`;
    } else if (
      (Math.abs(d.source.positionIndex[0] - d.target.positionIndex[0]) ===
        Math.abs(d.source.positionIndex[1] - d.target.positionIndex[1])
      ) && Math.abs(d.source.positionIndex[1] - d.target.positionIndex[1]) >= 2
    ) {
      return `M${d.source.x},${d.source.y
      }Q${d.source.x},${((2 * d.source.y) + d.target.y) / 3
      } ${((2 * d.source.x) + d.target.x) / 3},${(d.source.y + (2 * d.target.y)) / 3
      }T ${d.target.x},${d.target.y}`;
    }
    return `M${d.source.x},${d.source.y
    }L${(d.source.x + d.target.x) / 2},${(d.source.y + d.target.y) / 2
    }L${d.target.x},${d.target.y}`;
  }

  function ticked() {
    link.attr('d', positionLink);

    node
      .attr('cx', (d) => { d.x = Math.max(radius, Math.min(width - radius, d.x)); return d.x; })
      .attr('cy', (d) => { d.y = Math.max(radius, Math.min(height - radius, d.y)); return d.y; })
      .attr('transform', d => `translate(${[d.x, d.y]})`);
  }

  // Put the nodes and edges in the correct spots
  simulation
    .nodes(nodes)
    .on('tick', ticked);

  simulation.force('link')
    .links(edges);

  legendCreator(legend, nodes, legendWidth, color);
}

/**
 * formatField: Recurisvely inserts newline characters into strings that are
 *    too long after underscores
 */
function formatField(name) {
  if (name.length > 20) {
    const splitName = name.split('_');
    if (splitName.length === 1) {
      return name;
    }
    const mid = Math.ceil(splitName.length / 2);
    let begin = splitName.slice(0, mid).join('_');
    let end = splitName.slice(mid).join('_');
    if (begin.length > 20) {
      begin = formatField(begin);
    }
    if (end.length > 20) {
      end = formatField(end);
    }
    return `${begin}_\n${end}`;
  }
  return name;
}

/**
 * formatType: Turn different ways used to represent type in data dictionary
 *    into a string
 */
function formatType(type) {
  if (typeof type === 'string') {
    return type;
  } else if ('type' in type) {
    if (typeof type.type !== 'string') {
      let filteredType = type.type.filter(x => x !== 'null');
      filteredType = filteredType.join(',\n');
      return filteredType;
    }
    return type.type;
  } else if ('enum' in type) {
    return 'enum';
  } else if ('oneOf' in type) {
    if (typeof type.oneOf === 'object' && 'enum' in type.oneOf[0] && type.oneOf[0].enum[0] === 'uploading') {
      if ('downloadable' in type) {
        return 'enum';
      }
    }
    let filteredType = type.oneOf.map(x => x.type);
    filteredType = filteredType.filter(x => x !== 'null');
    if (type.oneOf.length > 2) {
      return `${filteredType.slice(0, 2).join(', \n')}, etc.`;
    }
    return filteredType.join(', \n');
  }
  return 'unknown';
}

/**
 * addTables: Add tables to data dictionary graph.
 *    Also hides the node names rendered by svg and replaces them with non-svg
 *    text so they remain clickable
 */
function addTables(nodes, boxWidth, boxHeight, svgWidth, svgHeight) {
  const tableDiv = d3.select('#graph_wrapper')
    .append('div')
    .style('position', 'absolute')
    .style('left', '50%')
    .style('top', '40')
    .style('margin-left', `${svgWidth / -2}px`)
    .style('width', `${svgWidth}px`)
    .style('height', `${svgHeight}px`)
    .attr('id', 'table_wrapper')
    .selectAll('div')
    .data(nodes)
    .enter()
    .append('div')
    .style('position', 'absolute')
    .style('padding-top', '8px')
    .style('left', d => `${d.fx - ((boxWidth / 2) - 6)}px`)
    .style('top', d => `${d.fy - ((boxHeight / 2) - 20)}px`);

  tableDiv.append('div')
    .style('text-align', 'center')
    .append('a')
    .attr('href', (d) => {
      const uri = window.location.href;
      return `${uri.substring(0, uri.lastIndexOf('/'))}/${d.id}`;
    })
    .attr('target', '_blank')
    .style('font-size', `${13}px`)
    .style('color', 'black')
    .style('text-align', 'center')
    .style('font-weight', 'bold')
    .text(d => d.title);

  tableDiv.append('div')
    .style('width', `${boxWidth - 12}px`)
    .style('height', `${boxHeight - 30}px`)
    .style('font-size', `${12}px`)
    .style('color', 'black')
    .style('overflow', 'auto')
    .append('table')
    .style('border-collapse', 'collapse')
    .style('border', '1px solid black')
    .style('width', '100%')
    .append('tbody')
    .selectAll('tr')
    .data((d) => {
      const unsorted = Object.entries(d.properties).filter(x => !('anyOf' in x[1])).map(x => ({ column: x[0], value: x[1] }));
      const isRequiredList = [];
      const notRequiredList = [];
      unsorted.forEach((val) => {
        if (d.required && d.required.indexOf(val.column) !== -1) {
          val.required = true;
          isRequiredList.push(val);
        } else {
          val.required = false;
          notRequiredList.push(val);
        }
      });
      return isRequiredList.concat(notRequiredList);
    })
    .enter()
    .append('tr')
    .style('border', '1px solid black')
    .style('padding', '5px')
    .style('font-weight', d => (d.required ? 'bold' : 'normal'))
    .style('font-style', d => (d.required ? 'italic' : 'normal'))
    .selectAll('td')
    .data(row => Object.entries(row).filter(x => x[0] !== 'required'))
    .enter()
    .append('td')
    .style('border', '1px solid black')
    .style('padding', '5px')
    .text(d => (d[0] === 'column' ? formatField(d[1]) : formatType(d[1])));

  for (let n = 0; n < nodes.length; n += 1) {
    d3.select('#'.concat(nodes[n].id))
      .selectAll('text')
      .attr('dy', -(0.5 * boxHeight) + 15)
      .style('display', 'none');
  }

  d3.select('#graph_wrapper').select('#toggle_button').style('z-index', '1');
}

export function createFullGraph(nodesIn, edgesIn) {
  const radius = 60;
  const boxHeight = radius * 4;
  const boxWidth = radius * 4;

  const nodes = nodesIn.filter(nd => !!nd.position); // ignore anchorless nodes
  const nNames = nodes.map(n => n.id);
  const edges = edgesIn.filter(
    e => (nNames.includes(e.source.id) && nNames.includes(e.target.id)),
  );
  const maxX = Math.round(1 / d3.extent(nodes.map(node => node.position[0]))[0]);
  const maxY = Math.round(1 / d3.extent(nodes.map(node => node.position[1]))[0]);

  const svgWidth = maxX * radius * 5;
  const svgHeight = maxY * radius * 5;

  createDDGraph(nodes, edges, radius, 4, 4, 5);

  if (document.getElementById('table_wrapper') != null) {
    document.getElementById('table_wrapper').remove();
  }

  addTables(nodes, boxWidth, boxHeight, svgWidth, svgHeight);
}

export function createAbridgedGraph(nodesIn, edgesIn) {
  const nodes = nodesIn.filter(nd => !!nd.position); // ignore anchorless nodes
  const nNames = nodes.map(n => n.id);
  const edges = edgesIn.filter(
    e => (nNames.includes(e.source.id) && nNames.includes(e.target.id)),
  );
  createDDGraph(nodes, edges, 60, 1.5, 3, 3);
}
