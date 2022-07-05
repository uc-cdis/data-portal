import { lineLimit } from '../localconf';

/** @typedef {import('../redux/types').RootState} RootState */
/** @typedef {import('./types').SubmissionState} SubmissionState */

/**
 * @param {RootState['submission']['dictionary']} dictionary
 * @param {string} name
 */
function checkIfRelevantNodeForCounts(dictionary, name) {
  return (
    !name.startsWith('_') &&
    name !== 'program' &&
    name !== 'metaschema' &&
    dictionary[name].category !== 'internal'
  );
}

/**
 * @param {RootState['submission']['dictionary']} dictionary
 * @param {RootState['submission']['nodeTypes']} nodeTypes
 * @param {string} project
 */
export function buildCountsQuery(dictionary, nodeTypes, project) {
  let query = '{';

  function appendCountToQuery(name) {
    query += `_${name}_count (project_id:"${project}"),`;
  }
  for (const name of nodeTypes)
    if (checkIfRelevantNodeForCounts(dictionary, name))
      appendCountToQuery(name);

  function appendLinkToQuery({ name, source, target }) {
    if (name && target && target !== 'program')
      query += `${source}_${name}_to_${target}_link: ${source}(with_links: ["${name}"], first:1, project_id:"${project}"){submitter_id},`;
  }
  for (const [name, node] of Object.entries(dictionary))
    if (checkIfRelevantNodeForCounts(dictionary, name) && node.links)
      for (const link of node.links) {
        appendLinkToQuery({
          name: link.name,
          source: name,
          target: dictionary[link.target_type]?.id,
        });

        if (link.subgroup)
          for (const sLink of link.subgroup)
            appendLinkToQuery({
              name: sLink.name,
              source: name,
              target: dictionary[sLink.target_type]?.id,
            });
      }

  query += '}';

  return query;
}

export const excludeSystemProperties = (node) => {
  const properties =
    node.properties &&
    Object.keys(node.properties)
      .filter((key) =>
        node.systemProperties ? !node.systemProperties.includes(key) : true
      )
      .reduce((acc, key) => {
        acc[key] = node.properties[key];
        return acc;
      }, {});
  return properties;
};

export const getDictionaryWithExcludeSystemProperties = (dictionary) => {
  const ret = Object.keys(dictionary)
    .map((nodeID) => {
      const node = dictionary[nodeID];
      if (!node.properties) return node;
      return {
        ...node,
        properties: excludeSystemProperties(node),
      };
    })
    .reduce((acc, node) => {
      acc[node.id] = node;
      return acc;
    }, {});
  return ret;
};

/**
 * @param {Object} args
 * @param {string} args.file
 * @param {string} args.fileType
 */
export function getFileChunksToSubmit({ file, fileType }) {
  /** @type {string[]} */
  const fileChunks = [];

  if (fileType === 'text/tab-separated-values') {
    const fileSplited = file.split(/\r\n?|\n/g);
    if (fileSplited.length > lineLimit && lineLimit > 0) {
      let fileHeader = fileSplited[0];
      fileHeader += '\n';
      let count = lineLimit;
      let fileChunk = fileHeader;

      for (let i = 1; i < fileSplited.length; i += 1) {
        if (fileSplited[i] !== '') {
          fileChunk += fileSplited[i];
          fileChunk += '\n';
          count -= 1;
        }
        if (count === 0) {
          fileChunks.push(fileChunk);
          fileChunk = fileHeader;
          count = lineLimit;
        }
      }
      if (fileChunk !== fileHeader) {
        fileChunks.push(fileChunk);
      }
    } else {
      fileChunks.push(file);
    }
  } else {
    // remove line break in json file
    fileChunks.push(file.replace(/\r\n?|\n/g, ''));
  }

  return fileChunks;
}

export const FETCH_LIMIT = 1024;
export const STARTING_DID = '00000000-0000-0000-0000-000000000000';
