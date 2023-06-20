const downloadTSVFromJson = (filename, arrayOfJson) => {
  // See here: https://stackoverflow.com/a/55584453
  // convert JSON to CSV
  const replacer = (key, value) => (value === null ? '' : value); // specify how you want to handle null values here
  const header = Object.keys(arrayOfJson[0]);
  let tsv = arrayOfJson.map((row) => header
    .map((fieldName) => JSON.stringify(row[fieldName], replacer))
    .join('\t'),
  );
  tsv.unshift(header.join('\t'));
  tsv = tsv.join('\r\n');

  // Create link and download
  const link = document.createElement('a');
  link.setAttribute(
    'href',
    `data:text/csv;charset=utf-8,%EF%BB%BF${encodeURIComponent(tsv)}`,
  );
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default downloadTSVFromJson;
