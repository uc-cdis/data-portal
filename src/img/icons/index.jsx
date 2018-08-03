import React from 'react';
import IcoAnalysis from './analysis.svg';
import IcoBack from './back.svg';
import IcoCopy from './copy.svg';
import IcoCross from './cross.svg';
import IcoCrossKey from './cross-key.svg';
import IcoDataAccess from './data-access.svg';
import IcoDataAnalyze from './data-analyze.svg';
import IcoDataExplore from './data-explore.svg';
import IcoDataFieldDefine from './data-field-define.svg';
import IcoDataFiles from './data-files.svg';
import IcoDataSubmit from './data-submit.svg';
import IcoDelete from './delete.svg';
import IcoDictionary from './dictionary.svg';
import IcoDownload from './download.svg';
import IcoExit from './exit.svg';
import IcoExploration from './exploration.svg';
import IcoFiles from './files.svg';
import IcoGen3 from './gen3.svg';
import IcoGene from './gene.svg';
import IcoKey from './key.svg';
import IcoProfile from './profile.svg';
import IcoQuery from './query.svg';
import IcoSignature from './signature.svg';
import IcoUpload from './upload.svg';
import IcoUploadWhite from './upload-white.svg';
import IcoWorkspace from './workspace.svg';

const dictIcons = {
  analysis: (height, customedStyles) => (
    <IcoAnalysis
      height={height}
      style={{ ...customedStyles }}
    />),
  back: (height, customedStyles) => (
    <IcoBack height={height} style={{ ...customedStyles }} />
  ),
  copy: (height, customedStyles) => (
    <IcoCopy height={height} style={{ ...customedStyles }} />
  ),
  cross: (height, customedStyles) => (
    <IcoCross height={height} style={{ ...customedStyles }} />
  ),
  'cross-key': (height, customedStyles) => (
    <IcoCrossKey height={height} style={{ ...customedStyles }} />
  ),
  'data-access': (height, customedStyles) => (
    <IcoDataAccess height={height} style={{ ...customedStyles }} />
  ),
  'data-analyze': (height, customedStyles) => (
    <IcoDataAnalyze height={height} style={{ ...customedStyles }} />
  ),
  'data-explore': (height, customedStyles) => (
    <IcoDataExplore height={height} style={{ ...customedStyles }} />
  ),
  'data-field-define': (height, customedStyles) => (
    <IcoDataFieldDefine height={height} style={{ ...customedStyles }} />
  ),
  'data-files': (height, customedStyles) => (
    <IcoDataFiles height={height} style={{ ...customedStyles }} />
  ),
  'data-submit': (height, customedStyles) => (
    <IcoDataSubmit height={height} style={{ ...customedStyles }} />
  ),
  delete: (height, customedStyles) => (
    <IcoDelete height={height} style={{ ...customedStyles }} />
  ),
  dictionary: (height, customedStyles) => (
    <IcoDictionary height={height} style={{ ...customedStyles }} />
  ),
  download: (height, customedStyles) => (
    <IcoDownload height={height} style={{ ...customedStyles }} />
  ),
  exit: (height, customedStyles) => (
    <IcoExit height={height} style={{ ...customedStyles }} />
  ),
  exploration: (height, customedStyles) => (
    <IcoExploration height={height} style={{ ...customedStyles }} />
  ),
  files: (height, customedStyles) => (
    <IcoFiles height={height} style={{ ...customedStyles }} />
  ),
  gen3: (height, customedStyles) => (<IcoGen3
    height={height}
    style={{ ...customedStyles }}
  />),
  gene: (height, customedStyles) => (
    <IcoGene
      height={height}
      style={{ ...customedStyles }}
    />
  ),
  key: (height, customedStyles) => (
    <IcoKey height={height} style={{ ...customedStyles }} />
  ),
  profile: (height, customedStyles) => (
    <IcoProfile height={height} style={{ ...customedStyles }} />
  ),
  query: (height, customedStyles) => (
    <IcoQuery height={height} style={{ ...customedStyles }} />
  ),
  upload: (height, customedStyles) => (
    <IcoUpload height={height} style={{ ...customedStyles }} />
  ),
  'upload-white': (height, customedStyles) => (
    <IcoUploadWhite height={height} style={{ ...customedStyles }} />
  ),
  workspace: (height, customedStyles) => (
    <IcoWorkspace height={height} style={{ ...customedStyles }} />
  ),
  uchicago: (height, customedStyles) => (
    <IcoSignature
      height={height}
      style={{ ...customedStyles }}
    />
  ),
};

export default dictIcons;
