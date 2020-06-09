const papaparse = require('papaparse');

export function numberWithCommas(x) {
  return x ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : 0;
}

export async function readSingleColumnTSV(tsvData) {
  let headers = null;
  let dateIndex;
  let valueIndex;
  const contents = {};
  const parseFile = rawFile => new Promise((resolve) => {
    papaparse.parse(rawFile, {
      worker: true,
      skipEmptyLines: true,
      step(row) {
        if (!headers) {
          headers = row.data;
          dateIndex = headers.findIndex(x => x === 'date');
          valueIndex = headers.findIndex(x => x !== 'date');
        } else {
          contents[row.data[dateIndex]] = row.data[valueIndex];
        }
      },
      complete: () => resolve(contents),
    });
  });
  const parsedData = await parseFile(tsvData);
  return parsedData;
}

export async function readMultiColumnTSV(tsvData) {
  let headers = null;
  let dateIndex;
  const contents = {};
  const parseFile = rawFile => new Promise((resolve) => {
    papaparse.parse(rawFile, {
      worker: true,
      skipEmptyLines: true,
      step(row) {
        if (!headers) {
          headers = row.data;
          dateIndex = headers.findIndex(x => x === 'date');
          for (let index = 0; index < headers.length; index += 1) {
            if (index !== dateIndex) {
              const col = headers[index];
              contents[col] = {};
            }
          }
        } else {
          for (let index = 0; index < headers.length; index += 1) {
            if (index !== dateIndex) {
              const col = headers[index];
              contents[col][row.data[dateIndex]] = row.data[index];
            }
          }
        }
      },
      complete: () => resolve(contents),
    });
  });
  const parsedData = await parseFile(tsvData);

  return Object.entries(parsedData).map(([key, value]) => ({
    data: value,
    name: key,
  }));
}
