import { submissionApiPath, gen3ZendeskURL } from './localconf';
import { getCategoryColor } from './DataDictionary/NodeCategories/helper';

const ZENDESK_MAX_SUBJECT_LENGTH = 255;

export const humanFileSize = (size) => {
  if (typeof size !== 'number') {
    return '';
  }
  const i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
  const sizeStr = (size / (1024 ** i)).toFixed(2) * 1;
  const suffix = ['B', 'KB', 'MB', 'GB', 'TB'][i];
  return `${sizeStr} ${suffix}`;
};

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
 * @param {()=>Promise} lambda callback should return a Promise
 * @param {int} timeoutMs passed through to setinterval
 * @return the setinterval id (can be passed to clearinterval)
 */
export async function asyncSetInterval(lambda, timeoutMs) {
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
    if (a < b) {
      return -1;
    } if (a > b) {
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
    .attr('fill', (d) => getCategoryColor(d))
    .style('font-size', legendFontSize)
    .text((d) => d);

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

export function capitalizeFirstLetter(str) {
  const res = str.replace(/_|\./gi, ' ');
  return res.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

/**
 * Avoid importing underscore just for this ... export for testing
 * @method intersection
 * @param aList {Array<String>}
 * @param bList {Array<String>}
 * @return list of intersecting elements
 */
export function intersection(aList, bList) {
  const key2Count = aList.concat(bList).reduce(
    (db, it) => {
      const res = db;
      if (res[it]) { res[it] += 1; } else { res[it] = 1; }
      return res;
    }, {},
  );
  return Object.entries(key2Count)
    .filter((kv) => kv[1] > 1)
    .map(([k]) => k);
}

export function minus(aList, bList) {
  const key2Count = aList.concat(bList).concat(aList).reduce(
    (db, it) => {
      const res = db;
      if (res[it]) { res[it] += 1; } else { res[it] = 1; }
      return res;
    }, {},
  );
  return Object.entries(key2Count)
    .filter((kv) => kv[1] === 2)
    .map(([k]) => k);
}

export const parseParamWidth = (width) => ((typeof width === 'number') ? `${width}px` : width);

export const isPageFullScreen = (pathname) => (!!((pathname
  && (pathname.toLowerCase() === '/dd'
  || pathname.toLowerCase().startsWith('/dd/')
  || pathname.toLowerCase() === '/cohort-tools'
  || pathname.toLowerCase().startsWith('/cohort-tools/')
  ))));

export const isFooterHidden = (pathname) => (!!((pathname
  && (pathname.toLowerCase() === '/dd'
  || pathname.toLowerCase().startsWith('/dd/')
  ))));

export const createZendeskTicket = async (subject, fullName, email, contents, zendeskSubdomainName) => {
  try {
    const zendeskTicketCreationURL = `${gen3ZendeskURL}/api/v2/requests`;
    if (zendeskSubdomainName) {
      zendeskTicketCreationURL.replace('<SUBDOMAIN_NAME>', zendeskSubdomainName);
    } else {
      zendeskTicketCreationURL.replace('<SUBDOMAIN_NAME>', 'gen3support');
    }
    let ticketSubject = subject;
    if (subject.length > ZENDESK_MAX_SUBJECT_LENGTH) {
      ticketSubject = `${subject.substring(
        0,
        ZENDESK_MAX_SUBJECT_LENGTH - 3,
      )}...`;
    }
    await fetch({
      path: zendeskTicketCreationURL,
      method: 'POST',
      customHeaders: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        request: {
          subject: ticketSubject,
          comment: {
            body: contents,
          },
          requester: {
            name: fullName,
            email,
          },
        },
      }),
    }).then((response) => {
      if (response.status !== 201) {
        throw new Error(`Request for create Zendesk ticket failed with status ${response.status}`);
      }
      return response;
    });
  } catch (err) {
    throw new Error(`Request for create Zendesk ticket failed: ${err}`);
  }
};

export const validFileNameChecks = {
  fileNameCharactersCheckRegex: /[^a-zA-Z0-9[\]() ._-]+/g,
  invalidWindowsFileNames: ['CON', 'PRN', 'AUX', 'NUL', 'COM0',
    'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9', 'LPT0',
    'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9'],
  maximumAllowedFileNameLength: 250,
};
