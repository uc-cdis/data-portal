export const getFileNodes = (dictionary) => {
  return Object.keys(dictionary).filter( node => {return dictionary[node].category == 'data_file'})
}

export const getNodeTypes = (dictionary) => {
  return Object.keys(dictionary).filter( node => {return node.charAt(0) != '_'})
}

