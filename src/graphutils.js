export const getFileNodes = dictionary => Object.keys(dictionary).filter(node => dictionary[node].category === 'data_file');
export const getNodeTypes = dictionary => Object.keys(dictionary).filter(node => node.charAt(0) !== '_');
