import React from 'react';
import IcoBAM from './bam.svg';
import IcoBED from './bed.svg';
import IcoCSV from './csv.svg';
import IcoFile from './file.svg';
import IcoPNG from './png.svg';
import IcoRAW from './raw.svg';
import IcoTAR from './tar.svg';
import IcoTSV from './tsv.svg';
import IcoTXT from './txt.svg';
import IcoZIP from './zip.svg';

const dictIcons = {
  bam: (height, customedStyles) => (
    <IcoBAM height={height} style={{ ...customedStyles }} />
  ),
  bed: (height, customedStyles) => (
    <IcoBED height={height} style={{ ...customedStyles }} />
  ),
  csv: (height, customedStyles) => (
    <IcoCSV height={height} style={{ ...customedStyles }} />
  ),
  file: (height, customedStyles) => (
    <IcoFile height={height} style={{ ...customedStyles }} />
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
