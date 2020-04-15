const papaparse = require('papaparse');

export function numberWithCommas(x) {
  return x ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : 0;
}

export async function formatSeirData(tsvData) {
  let headers = null;
  let dateIndex;
  let valueIndex;
  const contents = {};
  papaparse.parse(tsvData, {
    worker: true,
    step(row) {
      if (!headers) {
        headers = row.data;
        dateIndex = headers.findIndex(x => x === 'date');
        valueIndex = headers.findIndex(x => x !== 'date');
      } else if (row.data.length >= 2) { // skip empty line at end of file
        contents[row.data[dateIndex]] = row.data[valueIndex];
      }
    },
  });
  return contents;
}
