import IcoAnalysis from './analysis.svg';
import IcoBack from './back.svg';
import IcoCohortTools from './cohort-tools.svg';
import IcoCopy from './copy.svg';
import IcoCheckbox from './check.svg';
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
import IcoKey from './key.svg';
import IcoProfile from './profile.svg';
import IcoQuery from './query.svg';
import IcoSignature from './signature.svg';
import IcoStatusError from './status_wrong.svg';
import IcoStatusReady from './status_ready.svg';
import IcoUpload from './upload.svg';
import IcoUploadWhite from './upload-white.svg';
import IcoWorkspace from './workspace.svg';
import IcoFilter from './filter-solid.svg';

/** @type {{ [iconName: string]: (height: string, style: Object) => JSX.Element}} */
const dictIcons = {
  analysis: (height, style) => <IcoAnalysis height={height} style={style} />,
  back: (height, style) => <IcoBack height={height} style={style} />,
  'cohort-tools': (height, style) => (
    <IcoCohortTools height={height} style={style} />
  ),
  copy: (height, style) => <IcoCopy height={height} style={style} />,
  checkbox: (height, style) => <IcoCheckbox height={height} style={style} />,
  cross: (height, style) => <IcoCross height={height} style={style} />,
  'cross-key': (height, style) => <IcoCrossKey height={height} style={style} />,
  'data-access': (height, style) => (
    <IcoDataAccess height={height} style={style} />
  ),
  'data-analyze': (height, style) => (
    <IcoDataAnalyze height={height} style={style} />
  ),
  'data-explore': (height, style) => (
    <IcoDataExplore height={height} style={style} />
  ),
  'data-field-define': (height, style) => (
    <IcoDataFieldDefine height={height} style={style} />
  ),
  'data-files': (height, style) => (
    <IcoDataFiles height={height} style={style} />
  ),
  'data-submit': (height, style) => (
    <IcoDataSubmit height={height} style={style} />
  ),
  delete: (height, style) => <IcoDelete height={height} style={style} />,
  dictionary: (height, style) => (
    <IcoDictionary height={height} style={style} />
  ),
  download: (height, style) => <IcoDownload height={height} style={style} />,
  exit: (height, style) => <IcoExit height={height} style={style} />,
  exploration: (height, style) => (
    <IcoExploration height={height} style={style} />
  ),
  files: (height, style) => <IcoFiles height={height} style={style} />,
  gen3: (height, style) => <IcoGen3 height={height} style={style} />,
  key: (height, style) => <IcoKey height={height} style={style} />,
  profile: (height, style) => <IcoProfile height={height} style={style} />,
  query: (height, style) => <IcoQuery height={height} style={style} />,
  status_error: (height, style) => (
    <IcoStatusError height={height} style={style} />
  ),
  status_ready: (height, style) => (
    <IcoStatusReady height={height} style={style} />
  ),
  upload: (height, style) => <IcoUpload height={height} style={style} />,
  'upload-white': (height, style) => (
    <IcoUploadWhite height={height} style={style} />
  ),
  workspace: (height, style) => <IcoWorkspace height={height} style={style} />,
  uchicago: (height, style) => <IcoSignature height={height} style={style} />,
  filter: (height, style) => <IcoFilter height={height} style={style} />
};

export default dictIcons;
