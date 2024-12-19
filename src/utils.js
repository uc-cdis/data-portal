import { submissionApiPath } from './localconf';

export const humanFileSize = (size) => {
  if (typeof size !== 'number') {
    return '';
  }
  const i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
  const sizeStr = Number((size / 1024 ** i).toFixed(2));
  const suffix = ['B', 'KB', 'MB', 'GB', 'TB'][i];
  return `${sizeStr} ${suffix}`;
};

/** @param {string} project */
export const getSubmitPath = (project) => {
  const path = project.split('-');
  const programName = path[0];
  const projectCode = path.slice(1).join('-');
  return `${submissionApiPath}/${programName}/${projectCode}`;
};

/**
 * @param {any} data
 * @param {{ [key: string]: any }} schema
 */
export const jsonToString = (data, schema = {}) => {
  const replacer = (key, value) => {
    if (value === null) {
      return undefined;
    }
    if (schema[key] === 'number') {
      const castedValue = Number(value);
      if (Number.isNaN(castedValue)) {
        return value;
      }
      return castedValue;
    }
    return value;
  };
  return JSON.stringify(data, replacer, '  ');
};

/**
 * @param {string} dirtyData
 * @param {string} [fileType]
 */
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

/**
 * Little wrapper around setinterval with a guard to prevent an async function
 * from being invoked multiple times.
 *
 * @param {() => Promise} lambda callback should return a Promise
 * @param {number} timeoutMs passed through to setinterval
 * @return the setinterval id (can be passed to clearinterval)
 */
export function asyncSetInterval(lambda, timeoutMs) {
  let isRunningGuard = false;
  return window.setInterval(() => {
    if (!isRunningGuard) {
      isRunningGuard = true;

      lambda().then(() => {
        isRunningGuard = false;
      });
    }
  }, timeoutMs);
}

/** @param {string} category  */
export const getCategoryColor = (category) => {
  const colorMap = {
    clinical: '#05B8EE',
    biospecimen: '#27AE60',
    data_file: '#7EC500',
    metadata_file: '#F4B940',
    analysis: '#FF7ABC',
    administrative: '#AD91FF',
    notation: '#E74C3C',
    index_file: '#26D9B1',
    clinical_assessment: '#3283C8',
    medical_history: '#05B8EE',
    satellite: '#C49C94', // d3.schemeCategory20[11],
    radar: '#BCBD22', // d3.schemeCategory20[16],
    stream_gauge: '#9EDAE5', // d3.schemeCategory20[19],
    weather_station: '#8C564B', // d3.schemeCategory20[10],
    data_observations: '#FFBB78', // d3.schemeCategory20[3],
    experimental_methods: '#2CA02C', // d3.schemeCategory20[4],
    Imaging: '#98DF8A', // d3.schemeCategory20[5],
    study_administration: '#D62728', // d3.schemeCategory20[6],
    subject_characteristics: '#FF9896', // d3.schemeCategory20[7],
  };
  const defaultColor = '#9B9B9B';
  return colorMap[category] ? colorMap[category] : defaultColor;
};

/**
 * @param {import("d3-selection").Selection<SVGGElement>} legendGroup
 * @param {{ category: string }[]} nodes
 * @param {number} legendWidth
 */
export function legendCreator(legendGroup, nodes, legendWidth) {
  // Find all unique categories
  const uniqueCategoriesList = nodes.reduce((acc, elem) => {
    if (acc.indexOf(elem.category) === -1) {
      acc.push(elem.category);
    }
    return acc;
  }, []);
  uniqueCategoriesList.sort((aIn, bIn) => {
    const a = aIn.toLowerCase();
    const b = bIn.toLowerCase();
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  });

  const legendFontSize = '0.9em';
  // Make Legend
  legendGroup
    .selectAll('text')
    .data(uniqueCategoriesList)
    .enter()
    .append('text')
    .attr('x', legendWidth / 2)
    .attr('y', (d, i) => `${1.5 * (2.5 + i)}em`)
    .attr('text-anchor', 'middle')
    .attr('fill', (d) => getCategoryColor(d))
    .style('font-size', legendFontSize)
    .text((d) => d);

  legendGroup
    .append('text')
    .attr('x', legendWidth / 2)
    .attr('y', `${2}em`)
    .attr('text-anchor', 'middle')
    .text('Categories')
    .style('font-size', legendFontSize)
    .style('text-decoration', 'underline');
}

/** @param {import("d3-selection").Selection<SVGGElement>} graphSvg */
export function addArrows(graphSvg) {
  graphSvg
    .append('svg:defs')
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

/**
 * @param {import("d3-selection").Selection<SVGGElement>} graphSvg
 * @param {any[]} edges
 */
export function addLinks(graphSvg, edges) {
  return graphSvg
    .append('g')
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
 * @param {any[]} nodes each decorated with a position [width,height] in [0,1]
 * @param {number} graphWidth
 * @param {number} graphHeight
 */
export function calculatePosition(nodes, graphWidth, graphHeight) {
  // Calculate the appropriate position of each node on the graph
  const fyVals = [];
  const retNodes = nodes;
  for (let i = 0; i < nodes.length; i += 1) {
    retNodes[i].fx = retNodes[i].position[0] * graphWidth;
    retNodes[i].fy = retNodes[i].position[1] * graphHeight;
    if (fyVals.indexOf(retNodes[i].fy) === -1) {
      fyVals.push(retNodes[i].fy);
    }
  }
  return { retNodes, fyValsLength: fyVals.length };
}

/** @param {string} str */
export function capitalizeFirstLetter(str) {
  const res = str.replace(/_|\./gi, ' ');
  return res.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(),
  );
}

/**
 * Avoid importing underscore just for this ... export for testing
 * @method intersection
 * @param {string[]} aList
 * @param {string[]} bList
 * @return list of intersecting elements
 */
export function intersection(aList, bList) {
  const key2Count = aList.concat(bList).reduce((db, it) => {
    const res = db;
    if (res[it]) {
      res[it] += 1;
    } else {
      res[it] = 1;
    }
    return res;
  }, {});
  return Object.entries(key2Count)
    .filter((kv) => kv[1] > 1)
    .map(([k]) => k);
}

/** @param {number | string} width  */
export const parseParamWidth = (width) =>
  typeof width === 'number' ? `${width}px` : width;

/**
 * @param {import("react-select").Theme} theme
 * @returns {import("react-select").Theme}
 */
export function overrideSelectTheme(theme) {
  return {
    ...theme,
    colors: {
      ...theme.colors,
      primary: 'var(--pcdc-color__primary-light)',
    },
  };
}

/** @param {number | string} datetime */
export function formatLocalTime(datetime) {
  if (!datetime) return '';

  const date = new Date(datetime);
  const offset = -date.getTimezoneOffset() / 60;
  return `${date.toLocaleString()} UTC${offset < 0 ? '' : '+'}${offset}`;
}

export function isAdminUser(authz) {
  const {
    '/services/amanuensis': serviceAccessMethods,
    '/services/fence/admin': fenceAdminMethods,
  } = authz;
  const serviceAccessMethod = Array.isArray(serviceAccessMethods)
    ? serviceAccessMethods[0]?.method
    : undefined;
  const fenceAdminMethod = Array.isArray(fenceAdminMethods)
    ? fenceAdminMethods[0]?.method
    : undefined;
  return !!fenceAdminMethod || !!serviceAccessMethod;
}
