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
import IcoUchicago from './uchicago.svg';
import IcoUpload from './upload.svg';
import IcoUploadWhite from './upload-white.svg';
import IcoWorkspace from './workspace.svg';

const dictIcons = {
  'analysis': (height) => { return <IcoAnalysis height={height}/> },
  'data-access': (height) => { return <IcoDataAccess height={height}/> },
  'data-analyze': (height) => { return <IcoDataAnalyze height={height}/> },
  'data-explore': (height) => { return <IcoDataExplore height={height}/> },
  'data-field-define': (height) => { return <IcoDataFieldDefine height={height}/> },
  'dictionary': (height) => { return <IcoDictionary height={height}/> },
  'exit': (height) => { return <IcoExit height={height}/> },
  'exploration': (height) => { return <IcoExploration height={height}/> },
  'files': (height) => { return <IcoFiles height={height}/> },
  'gen3': (height) => {
    return <IcoGen3
      height={height} style={{
        position:"absolute",
        top:"-50%", bottom:"-50%",
        marginTop:"auto", marginBottom:"auto"
      }}/>},
  'profile': (height) => { return <IcoProfile height={height}/> },
  'query': (height) => { return <IcoQuery height={height}/> },
  'upload': (height) => { return <IcoUpload height={height}/> },
  'upload-white': (height) => { return <IcoUploadWhite height={height}/> },
  'workspace': (height) => { return <IcoWorkspace height={height}/> },
  'uchicago': (height) => {
    return <IcoSignature
      height={height}
      style={{
        position:"absolute",
        top:"-50%", bottom:"-50%",
        marginTop:"auto", marginBottom:"auto", fill: "#ffffff"}}/> },
};

export default dictIcons;
