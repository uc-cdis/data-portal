const dict = require('./data/dictionary.json');
const params = require('./src/params.js');

function makeSureHomepageChartWorks() {
  /**
   * this transfer '_xxx_count' to 'xxx'
   * @param {string} countName
   */
  function parseNodeType(countName) {
    return countName.substring(1, countName.length - '_count'.length);
  }
  const boardCountNodes = params.config.graphql.boardCounts.map(e => parseNodeType(e.graphql));
  const chartCountNodes = params.config.graphql.chartCounts.map(e => parseNodeType(e.graphql));

  /**
   * Check if all nodes exist in dictionary
   * @param {string[]} nodeList
   */
  function checkNodesExistInDict(nodeList) {
    for (let i = 0; i < nodeList.length; i += 1) {
      const nodeID = nodeList[i];
      if (typeof dict[nodeID] === 'undefined') {
        console.error(`ERR: "${nodeID}" does not exist`);
        process.exit(1);
      }
    }
  }

  checkNodesExistInDict(boardCountNodes);
  checkNodesExistInDict(chartCountNodes);
}

makeSureHomepageChartWorks();
process.exit(0);
