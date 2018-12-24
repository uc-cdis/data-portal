export const calculateFileSize = (size) => {
  if (size >= 1000000) {
    return `${size / 1000000}MB`;
  } else if (size >= 1000) {
    return `${size / 1000}KB`;
  }
  return `${size}B`;
};

const excludeSystemProperties = (node) => {
  const properties = node.properties && Object.keys(node.properties)
    .filter(key => (node.systemProperties ? !node.systemProperties.includes(key) : true))
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
