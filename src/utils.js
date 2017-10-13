import React from 'react';
import * as d3 from 'd3';

import { submissionApiPath } from './localconf';
import { Box, Body, Margin } from './theme';
import Nav from './Nav/ReduxNavBar';
import Footer from './components/Footer';
import ReduxAuthTimeoutPopup from './Popup/ReduxAuthTimeoutPopup';

export const getSubmitPath = (project) => {
  const path = project.split('-');
  const programName = path[0];
  const projectCode = path.slice(1).join('-');
  return `${submissionApiPath}/${programName}/${projectCode}`;
};

export const jsonToString = (data, schema = {}) => {
  const replacer = (key, value) => {
    if (value === null) {
      return undefined;
    }
    if (schema[key] === "number"){
      const castedValue = Number(value);
      if (isNaN(castedValue)) {
        return value;
      }
      return castedValue;
    }
    return value;
  };
  return JSON.stringify(data, replacer, '  ');
};

export const predictFileType = (dirtyData, fileType) => {
  const predictType = fileType;
  const jsonType = 'application/json';
  const tsvType = 'text/tab-separated-values';
  const data = dirtyData.trim();
  if (data.indexOf('{') !== -1 || data.indexOf('}') !== -1) {
    return jsonType;
  }
  if (data.indexOf('\t') !== -1) {
    return tsvType;
  }
  return predictType;
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
    <ReduxAuthTimeoutPopup />
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



export const color = {
  administrative: d3.schemeCategory20[12],
  analysis: d3.schemeCategory20[13],
  clinical: d3.schemeCategory20[11],
  biospecimen: d3.schemeCategory20[16],
  metadata_file: d3.schemeCategory20b[14],
  index_file: d3.schemeCategory20[18],
  notation: d3.schemeCategory20[19],
  data_file: d3.schemeCategory20[17],
  satellite: d3.schemeCategory20[11],
  radar: d3.schemeCategory20[16],
  streamgauge: d3.schemeCategory20[19],
};


export function legendCreator(legendGroup, nodes, legendWidth) {
  // Find all unique categories 
  const uniqueCategoriesList = nodes.reduce((acc, elem) => {
    if (acc.indexOf(elem.category) === -1) {
      acc.push(elem.category);
    }
    return acc;
  }, []);
  uniqueCategoriesList.sort((a, b) => {
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

  const legendFontSize = '0.9em';
  // Make Legend
  legendGroup.selectAll('text')
    .data(uniqueCategoriesList)
    .enter().append('text')
    .attr('x', legendWidth / 2)
    .attr('y', (d, i) => `${1.5 * (2.5 + i)}em`)
    .attr('text-anchor', 'middle')
    .attr('fill', d => color[d])
    .style('font-size', legendFontSize)
    .text(d => d);

  legendGroup.append('text')
    .attr('x', legendWidth / 2)
    .attr('y', `${2}em`)
    .attr('text-anchor', 'middle')
    .text('Categories')
    .style('font-size', legendFontSize)
    .style('text-decoration', 'underline');
}


export function addArrows(graphSvg) {
  graphSvg.append('svg:defs')
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

export function addLinks(graphSvg, edges) {
  return graphSvg.append('g')
    .selectAll('path')
    .data(edges)
    .enter()
    .append('path')
    .attr('stroke-width', 2)
    .attr('marker-mid', 'url(#end-arrow)')
    .attr('stroke', 'darkgray')
    .attr('fill', 'none');
}


/**
 * Compute SVG coordinates fx, fy for each node in nodes.
 * Decorate each node with .fx and .fy property as side effect.
 * 
 * @param {Array<Node>} nodes each decorated with a position [width,height] in [0,1] 
 * @param {*} graphWidth 
 * @param {*} graphHeight 
 */
export function calculatePosition(nodes, graphWidth, graphHeight) {
  // Calculate the appropriate position of each node on the graph
  const fyVals = [];
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].fx = nodes[i].position[0] * graphWidth;
    nodes[i].fy = nodes[i].position[1] * graphHeight;
    if (fyVals.indexOf(nodes[i].fy) === -1) {
      fyVals.push(nodes[i].fy);
    }
  }
  return { nodes, fyValsLength: fyVals.length };
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

export function computeLastPageSizes(filesMap, pageSize) {
  return Object.keys(filesMap).reduce((d, key) => {
    const result = d;
    result[key] = filesMap[key].length % pageSize;
    return result;
  }, {});
}
