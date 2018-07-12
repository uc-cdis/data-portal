import React from 'react';
import IcoBack from './file_icons/back.svg';
import IcoCSV from './file_icons/csv.svg';
import IcoPNG from './file_icons/png.svg';
import IcoRAW from './file_icons/raw.svg';
import IcoTAR from './file_icons/tar.svg';
import IcoTSV from './file_icons/tsv.svg';
import IcoTXT from './file_icons/txt.svg';
import IcoZIP from './file_icons/zip.svg';

const dictIcons = {
  back: (height, customedStyles) => (
    <IcoBack height={height} style={{ ...customedStyles }} />
  ),
  csv: (height, customedStyles) => (
    <IcoCSV height={height} style={{ ...customedStyles }} />
  ),
  png: (height, customedStyles) => (
    <IcoPNG height={height} style={{ ...customedStyles }} />
  ),
  raw: (height, customedStyles) => (
    <IcoRAW height={height} style={{ ...customedStyles }} />
  ),
  tar: (height, customedStyles) => (
    <IcoTAR height={height} style={{ ...customedStyles }} />
  ),
  tsv: (height, customedStyles) => (
    <IcoTSV height={height} style={{ ...customedStyles }} />
  ),
  txt: (height, customedStyles) => (
    <IcoTXT height={height} style={{ ...customedStyles }} />
  ),
  zip: (height, customedStyles) => (
    <IcoZIP height={height} style={{ ...customedStyles }} />
  ),
};

export default dictIcons;
