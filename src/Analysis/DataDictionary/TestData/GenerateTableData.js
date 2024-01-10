// Generates test data for DataDictionary
// Run in terminal like so:
// Node GenerateTableData.js

const fs = require('fs');
const numberOfEntries = 6000;
const maxValueSummarySize = 25;
const fileName = 'TableData.ts';

function randomString() {
  const length = 10;
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}
const funName = () => {
  const funNames = [
    'squirrel',
    'hotdog',
    'moose',
    'moonbeam',
    'cheese',
    'lobster',
    'robot',
    'snorkel',
    'popcorn',
    'daisy',
  ];
  return funNames[Math.floor(Math.random() * 10)];
};
const randomNum = () => Math.floor(Math.random() * 100) + 1;

const GenerateEntry = (type, i) => {
  if (type === 'nonqualitative') {
    // histogram, nonqualitative
    return {
      vocabularyID: `histogram_nonqualitative_${funName()}_${randomString()}`,
      conceptID: i,
      conceptCode: randomString(),
      conceptName: `${funName()}_${randomString()}`,
      conceptClassID: randomString(),
      numberOfPeopleWithVariable: randomNum(),
      numberOfPeopleWhereValueIsFilled: randomNum(),
      numberOfPeopleWhereValueIsNull: randomNum(),
      valueStoredAs: 'Number',
      minValue: randomNum(),
      maxValue: randomNum(),
      meanValue: randomNum(),
      standardDeviation: randomNum(),
      valueSummary: Array.from({ length: maxValueSummarySize }, () => ({
        start: randomNum(),
        end: randomNum(),
        personCount: randomNum(),
      })),
    };
  }
  // barchart, qualitative
  return {
    vocabularyID: `barchart_qualitative_${funName()}_${randomString()}`,
    conceptID: i,
    conceptCode: randomString(),
    conceptName: `${funName()}_${randomString()}`,
    conceptClassID: randomString(),
    numberOfPeopleWithVariable: randomNum(),
    numberOfPeopleWhereValueIsFilled: randomNum(),
    numberOfPeopleWhereValueIsNull: randomNum(),
    valueStoredAs: `NotANumber_${randomString()}`,
    minValue: null,
    maxValue: null,
    meanValue: null,
    standardDeviation: null,
    valueSummary: Array.from({ length: maxValueSummarySize }, () => ({
      name: `valueSummaryName${randomString()}`,
      valueAsString: randomString(),
      valueAsConceptID: randomNum(),
      personCount: randomNum(),
    })),
  };
};

let entries = '';
const GenerateTableEntries = () => {
  for (let i = 1; i < numberOfEntries; i = i + 2) {
    entries = `${entries}
    ${JSON.stringify(GenerateEntry('barChart', i))},
    ${JSON.stringify(GenerateEntry('histogram', i + 1))},`;
  }
};
GenerateTableEntries();

const output = `const TableData = {
  total: 250,
  data: [${entries}],
}
export default TableData;
`;
fs.writeFileSync(fileName, output);
console.info('Created test data!');
