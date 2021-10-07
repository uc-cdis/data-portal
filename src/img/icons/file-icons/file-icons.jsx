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

/** @type {{ [iconName: string]: (height: string, style: Object) => JSX.Element}} */
const dictIcons = {
  bam: (height, style) => <IcoBAM height={height} style={style} />,
  bed: (height, style) => <IcoBED height={height} style={style} />,
  csv: (height, style) => <IcoCSV height={height} style={style} />,
  file: (height, style) => <IcoFile height={height} style={style} />,
  png: (height, style) => <IcoPNG height={height} style={style} />,
  raw: (height, style) => <IcoRAW height={height} style={style} />,
  tar: (height, style) => <IcoTAR height={height} style={style} />,
  tsv: (height, style) => <IcoTSV height={height} style={style} />,
  txt: (height, style) => <IcoTXT height={height} style={style} />,
  zip: (height, style) => <IcoZIP height={height} style={style} />,
};

export default dictIcons;
