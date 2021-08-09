import { fetchWithCreds } from '../actions';
import { guppyGraphQLUrl, guppyDownloadUrl } from '../configs';

const papaparse = require('papaparse');

export async function readSingleColumnTSV(tsvData) {
  let headers = null;
  let dateIndex;
  let valueIndex;
  const contents = {};
  const parseFile = (rawFile) => new Promise((resolve) => {
    papaparse.parse(rawFile, {
      worker: true,
      skipEmptyLines: true,
      step(row) {
        if (!headers) {
          headers = row.data;
          dateIndex = headers.findIndex((x) => x === 'date');
          valueIndex = headers.findIndex((x) => x !== 'date');
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
  const parseFile = (rawFile) => new Promise((resolve) => {
    papaparse.parse(rawFile, {
      worker: true,
      skipEmptyLines: true,
      step(row) {
        if (!headers) {
          headers = row.data;
          dateIndex = headers.findIndex((x) => x === 'date');
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

export function readQuotedList(data) {
  // The data is a list of county FIPS surrounded by double quotes, such as:
  //   "17031"
  //   "17043"
  //   "17097"
  // This function takes this input and return a list of FIPS as strings:
  //   ['17031', '17043', '17097']
  return data.split('\n')
    .map((s) => s.replace(/"/g, ''))
    .filter((s) => !!s);
}

export async function queryGuppy(query, variables) {
  const body = { query, variables };
  const res = fetchWithCreds({
    path: guppyGraphQLUrl,
    method: 'POST',
    body: JSON.stringify(body),
  });
  return res;
}

export async function downloadFromGuppy(type, filter, fields) {
  const body = { type, filter, fields };
  const res = fetchWithCreds({
    path: guppyDownloadUrl,
    method: 'POST',
    body: JSON.stringify(body),
  });
  return res;
}
