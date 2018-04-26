import React from 'react';
import IcoAnalysis from './analysis.svg';
import IcoDataAccess from './data-access.svg';
import IcoDataAnalyze from './data-analyze.svg';
import IcoDataExplore from './data-explore.svg';
import IcoDataFieldDefine from './data-field-define.svg';
import IcoDictionary from './dictionary.svg';
import IcoExit from './exit.svg';
import IcoExploration from './exploration.svg';
import IcoFiles from './files.svg';
import IcoGen3 from './gen3.svg';
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
  dictionary: (height, customedStyles) => (
    <IcoDictionary height={height} style={{ ...customedStyles }} />
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
    style={{
      position: 'absolute',
      top: '-50%',
      bottom: '-50%',
      marginTop: 'auto',
      marginBottom: 'auto',
      ...customedStyles,
    }}
  />),
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
      style={{
        position: 'absolute',
        top: '-50%',
        bottom: '-50%',
        marginTop: 'auto',
        marginBottom: 'auto',
        ...customedStyles,
      }}
    />
  ),
};

export default dictIcons;
